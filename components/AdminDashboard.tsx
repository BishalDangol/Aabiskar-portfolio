/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  LogIn, 
  LogOut, 
  Check, 
  AlertCircle, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  FolderOpen,
  Image as ImageIcon,
  Copy,
  CheckCheck,
  UploadCloud,
  Star,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import { MultimediaProject, MultimediaCategory } from '../types';

// STRICT SINGLE ADMIN SPECIFICATION
export const AUTHORIZED_ADMIN_EMAIL = 'contact2bishaldangol@gmail.com';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjects: MultimediaProject[];
  onProjectsUpdated?: (projects: MultimediaProject[]) => void;
}

const CATEGORY_OPTIONS: { value: '3d' | 'video' | 'graphic' | 'interactive'; label: string }[] = [
  { value: '3d', label: '3D Hard Surface & Environment' },
  { value: 'video', label: 'Motion & Film' },
  { value: 'graphic', label: 'Visual Identity' },
  { value: 'interactive', label: 'Interactive Media' },
];

const PRESET_IMAGES = [
  { label: 'Cyber Mecha 3D', url: '/src/assets/images/cyber_mecha_3d_1792333944258.jpg' },
  { label: 'Motion Video Reel', url: '/src/assets/images/motion_video_reel_1792333960450.jpg' },
  { label: 'Graphic Design Poster', url: '/src/assets/images/graphic_design_system_1792333976150.jpg' },
  { label: 'Interactive Waves', url: '/src/assets/images/interactive_generative_art_1792333989351.jpg' },
  { label: 'Unreal 5 Citadel', url: '/src/assets/images/unreal_environment_3d_1792334005686.jpg' },
  { label: 'Cyber Supercar VFX', url: '/src/assets/images/vfx_commercial_film_1792334018715.jpg' },
  { label: 'Aegis Drone 3D', url: '/src/assets/images/drone_3d_robotics_1792335290933.jpg' },
  { label: 'Axis Architecture', url: '/src/assets/images/holographic_branding_1792335310920.jpg' }
];

// Helper to optimize and encode uploaded images for fast Firestore storage
const compressAndEncodeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If SVG, read directly as data URL
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDimension = 1600;
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Optimize to JPEG with 0.84 quality for superior balance between fidelity and size
        const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  isOpen, 
  onClose, 
  defaultProjects,
  onProjectsUpdated 
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [projects, setProjects] = useState<MultimediaProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | '3d' | 'video' | 'graphic' | 'interactive'>('all');

  // Form Modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isOptimizingImages, setIsOptimizingImages] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '3d' as '3d' | 'video' | 'graphic' | 'interactive',
    categoryLabel: '3D Hard Surface',
    year: new Date().getFullYear().toString(),
    client: '',
    image: PRESET_IMAGES[0].url,
    images: [PRESET_IMAGES[0].url] as string[],
    tools: '',
    summary: '',
    deliverables: '',
    featured: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Check if current user is the strictly designated single admin
  const isAuthorizedAdmin = !!(
    currentUser && 
    currentUser.email && 
    currentUser.email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()
  );

  const handleCopyUrl = () => {
    const directUrl = `${window.location.origin}${window.location.pathname}#admin`;
    navigator.clipboard.writeText(directUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Track Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore projects collection
  useEffect(() => {
    const projectsRef = collection(db, 'projects');
    const unsubscribe = onSnapshot(projectsRef, (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is empty, seed defaults
        seedDefaultProjects();
      } else {
        const loaded: MultimediaProject[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const primaryImg = data.image || PRESET_IMAGES[0].url;
          const imgList = Array.isArray(data.images) && data.images.length > 0 
            ? data.images 
            : [primaryImg];

          loaded.push({
            id: docSnap.id,
            title: data.title || 'Untitled Project',
            category: data.category || '3d',
            categoryLabel: data.categoryLabel || '3D Design',
            year: data.year || '2025',
            client: data.client || 'Studio Client',
            image: primaryImg,
            images: imgList,
            tools: Array.isArray(data.tools) ? data.tools : ['Blender'],
            summary: data.summary || '',
            deliverables: Array.isArray(data.deliverables) ? data.deliverables : ['Lookdev'],
            featured: !!data.featured
          });
        });

        // Sort by ID or year
        loaded.sort((a, b) => {
          const numA = parseInt(a.id);
          const numB = parseInt(b.id);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return a.title.localeCompare(b.title);
        });

        setProjects(loaded);
        if (onProjectsUpdated) {
          onProjectsUpdated(loaded);
        }
      }
      setLoadingProjects(false);
    }, (error) => {
      console.warn('Firestore subscription notice:', error);
      // Fallback to local default projects if offline
      setProjects(defaultProjects);
      setLoadingProjects(false);
    });

    return () => unsubscribe();
  }, []);

  // Seed default projects if collection is empty
  const seedDefaultProjects = async () => {
    try {
      for (const p of defaultProjects) {
        await setDoc(doc(db, 'projects', p.id), {
          title: p.title,
          category: p.category,
          categoryLabel: p.categoryLabel,
          year: p.year,
          client: p.client,
          image: p.image,
          images: p.images || [p.image],
          tools: p.tools,
          summary: p.summary,
          deliverables: p.deliverables,
          featured: !!p.featured,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Seeding note:', err);
    }
  };

  const handleSignIn = async () => {
    setActionError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setActionSuccess('Authentication processed.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setActionError(error?.message || 'Google sign-in failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setActionSuccess('Signed out.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error: any) {
      console.error('Sign-out error:', error);
    }
  };

  // Image Upload Handling (Single or Multiple)
  const processUploadedFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (validFiles.length === 0) {
      setActionError('Please select valid image files (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    setIsOptimizingImages(true);
    setActionError(null);

    try {
      const convertedDataUrls: string[] = [];
      for (const file of validFiles) {
        const dataUrl = await compressAndEncodeImage(file);
        convertedDataUrls.push(dataUrl);
      }

      setFormData((prev) => {
        // Filter out initial preset if user is adding fresh uploads
        const currentImages = prev.images.filter(img => !PRESET_IMAGES.some(preset => preset.url === img));
        const updatedImages = [...currentImages, ...convertedDataUrls];
        const newCover = updatedImages[0] || convertedDataUrls[0] || prev.image;
        return {
          ...prev,
          images: updatedImages,
          image: newCover
        };
      });

      setActionSuccess(`Successfully added ${validFiles.length} image${validFiles.length > 1 ? 's' : ''}!`);
      setTimeout(() => setActionSuccess(null), 2500);
    } catch (err) {
      console.error('Image processing error:', err);
      setActionError('Failed to process image files. Please try again.');
    } finally {
      setIsOptimizingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleSetCoverImage = (imgUrl: string) => {
    setFormData(prev => ({
      ...prev,
      image: imgUrl
    }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => {
      const remaining = prev.images.filter((_, idx) => idx !== indexToRemove);
      const newCover = remaining.includes(prev.image) 
        ? prev.image 
        : (remaining[0] || PRESET_IMAGES[0].url);
      return {
        ...prev,
        images: remaining.length > 0 ? remaining : [newCover],
        image: newCover
      };
    });
  };

  const handleAddCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    const url = customImageUrl.trim();
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url],
      image: prev.image || url
    }));
    setCustomImageUrl('');
  };

  const handleAddPresetImage = (presetUrl: string) => {
    setFormData(prev => {
      if (!prev.images.includes(presetUrl)) {
        return {
          ...prev,
          images: [...prev.images, presetUrl],
          image: prev.image || presetUrl
        };
      }
      return { ...prev, image: presetUrl };
    });
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: '3d',
      categoryLabel: '3D Hard Surface',
      year: new Date().getFullYear().toString(),
      client: '',
      image: PRESET_IMAGES[0].url,
      images: [PRESET_IMAGES[0].url],
      tools: 'Blender, Unreal Engine 5, Octane Render',
      summary: '',
      deliverables: '3D Sculpt, High-Poly Renders, Turnaround',
      featured: false
    });
    setCustomImageUrl('');
    setIsEditing(true);
    setActionError(null);
  };

  const openEditForm = (project: MultimediaProject) => {
    setEditingId(project.id);
    const existingImages = (project.images && project.images.length > 0) 
      ? project.images 
      : [project.image];

    setFormData({
      title: project.title,
      category: project.category,
      categoryLabel: project.categoryLabel,
      year: project.year,
      client: project.client,
      image: project.image,
      images: existingImages,
      tools: project.tools.join(', '),
      summary: project.summary,
      deliverables: project.deliverables.join(', '),
      featured: !!project.featured
    });
    setCustomImageUrl('');
    setIsEditing(true);
    setActionError(null);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    if (!isAuthorizedAdmin) {
      setActionError(`Unauthorized: Only ${AUTHORIZED_ADMIN_EMAIL} can save changes.`);
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    const toolsArray = formData.tools
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const deliverablesArray = formData.deliverables
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);

    const targetId = editingId || (Date.now().toString());
    const finalCoverImage = formData.image || formData.images[0] || PRESET_IMAGES[0].url;
    const finalImagesList = formData.images.length > 0 ? formData.images : [finalCoverImage];

    try {
      const projectPayload = {
        title: formData.title.trim(),
        category: formData.category,
        categoryLabel: formData.categoryLabel.trim() || formData.category.toUpperCase(),
        year: formData.year.trim(),
        client: formData.client.trim(),
        image: finalCoverImage,
        images: finalImagesList,
        tools: toolsArray.length > 0 ? toolsArray : ['Creative Tools'],
        summary: formData.summary.trim(),
        deliverables: deliverablesArray.length > 0 ? deliverablesArray : ['Lookdev Deliverable'],
        featured: formData.featured,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'projects', targetId), projectPayload, { merge: true });

      setIsEditing(false);
      setActionSuccess(editingId ? 'Project successfully updated!' : 'New project published to portfolio!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${targetId}`);
      setActionError('Failed to save project to Firestore. Please verify permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!isAuthorizedAdmin) {
      setActionError(`Unauthorized: Only ${AUTHORIZED_ADMIN_EMAIL} can delete projects.`);
      return;
    }

    setActionError(null);
    try {
      await deleteDoc(doc(db, 'projects', id));
      setDeletingId(null);
      setActionSuccess('Project deleted successfully.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
      setActionError('Failed to delete project. Please verify permissions.');
    }
  };

  const handleResetDefaults = async () => {
    if (!isAuthorizedAdmin) {
      setActionError(`Unauthorized: Only ${AUTHORIZED_ADMIN_EMAIL} can reset defaults.`);
      return;
    }

    if (!window.confirm('Reset all portfolio projects back to the curated 12 master works? This will overwrite manual changes.')) {
      return;
    }
    setLoadingProjects(true);
    setActionError(null);
    try {
      await seedDefaultProjects();
      setActionSuccess('Portfolio reset to default curated 12 projects.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
      setActionError('Failed to reset portfolio in Firestore.');
    } finally {
      setLoadingProjects(false);
    }
  };

  // Filter projects by search and category
  const filteredProjects = projects.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesQuery = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-5xl h-[92vh] bg-[#0d1017] border border-[#00f0ff] rounded-lg overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Top Header Bar */}
        <div className="bg-[#08090d] border-b border-white/10 p-4 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-sm ${isAuthorizedAdmin ? 'bg-[#00f0ff] text-black' : 'bg-white/10 text-white'}`}>
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Aabiskar Portfolio Admin
                </h2>
                {isAuthorizedAdmin && (
                  <span className="text-[10px] font-mono uppercase bg-[#00f0ff]/15 text-[#00f0ff] px-2 py-0.5 rounded border border-[#00f0ff]/30 font-semibold">
                    Sole Admin Verified
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono text-gray-400">
                Authorized Single Admin: <span className="text-gray-300 font-semibold">{AUTHORIZED_ADMIN_EMAIL}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#12151e] border border-white/10 px-3 py-1.5 rounded text-xs font-mono">
                {currentUser.photoURL && (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-5 h-5 rounded-full" />
                )}
                <span className="text-gray-300 hidden md:inline truncate max-w-[160px]">{currentUser.email}</span>
                {isAuthorizedAdmin ? (
                  <span className="text-[#00f0ff] font-bold">Admin</span>
                ) : (
                  <span className="text-red-400 font-bold">Unauthorized</span>
                )}
                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className="ml-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 bg-[#00f0ff] text-black px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Sign In With Google</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Admin"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {actionSuccess && (
          <div className="bg-[#00f0ff]/10 border-b border-[#00f0ff] text-[#00f0ff] px-6 py-2 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="bg-red-500/10 border-b border-red-500 text-red-400 px-6 py-2 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0c10]">
          {!currentUser ? (
            /* 1. Auth Required Screen */
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#12151e] border border-white/10 flex items-center justify-center text-[#00f0ff]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white uppercase">
                Studio Admin Authentication
              </h3>
              <p className="text-xs font-mono text-gray-400 leading-relaxed">
                Connect the verified Google account to create, edit, upload media, or delete multimedia projects from Aabiskar's live portfolio.
              </p>

              {/* Direct Login URL Card */}
              <div className="w-full bg-[#12151e] border border-white/10 p-3.5 rounded text-left space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Direct Admin Link</span>
                  <button
                    onClick={handleCopyUrl}
                    className="text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedUrl ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied URL!' : 'Copy Link'}</span>
                  </button>
                </div>
                <div className="bg-black/60 px-3 py-2 rounded text-xs font-mono text-[#00f0ff] truncate select-all border border-white/5">
                  {typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#admin` : '#admin'}
                </div>
              </div>

              <button
                onClick={handleSignIn}
                className="mt-2 w-full py-3.5 bg-[#00f0ff] text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00f0ff]/10"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Authenticate with Google</span>
              </button>

              <div className="text-[11px] font-mono text-gray-400 pt-2 border-t border-white/10 w-full">
                Strict single admin policy: <span className="text-[#00f0ff] font-semibold">{AUTHORIZED_ADMIN_EMAIL}</span>
              </div>
            </div>
          ) : !isAuthorizedAdmin ? (
            /* 2. Unauthorized Screen: Signed in with wrong account */
            <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto space-y-5">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wider">
                  Access Restricted — Unauthorized
                </h3>
                <p className="text-xs font-mono text-gray-400">
                  This portfolio administration portal enforces a strict single-admin security policy.
                </p>
              </div>

              <div className="w-full bg-[#12151e] border border-white/10 p-4 rounded text-left space-y-3 font-mono text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Currently Signed In As:</span>
                  <span className="text-red-400 font-semibold">{currentUser.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Designated Single Admin:</span>
                  <span className="text-[#00f0ff] font-semibold">{AUTHORIZED_ADMIN_EMAIL}</span>
                </div>
                <p className="text-gray-400 text-[11px] pt-2 border-t border-white/10 leading-relaxed">
                  Only the verified account (<span className="text-white">{AUTHORIZED_ADMIN_EMAIL}</span>) is granted permissions to manage or upload projects.
                </p>
              </div>

              <div className="w-full space-y-2">
                <button
                  onClick={handleSignIn}
                  className="w-full py-3 bg-[#00f0ff] text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
                >
                  Switch to Authorized Account
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full py-2.5 bg-white/5 border border-white/10 text-gray-300 font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* 3. Authorized Admin Management Interface */
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-heading font-bold text-white uppercase">
                      Portfolio Works Directory
                    </h3>
                    <span className="bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-mono px-2 py-0.5 rounded border border-[#00f0ff]/20">
                      {projects.length} Works
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-400">
                    Live Firestore synced database · Single Admin: <span className="text-[#00f0ff]">{currentUser.email}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={openCreateForm}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00f0ff] text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Project</span>
                  </button>

                  <button
                    onClick={handleResetDefaults}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#12151e] border border-white/15 text-gray-300 hover:text-white text-xs font-mono hover:border-white transition-colors cursor-pointer"
                    title="Reset to default 12 curated projects"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Reset Defaults</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, client, or software stack..."
                    className="w-full bg-[#12151e] border border-white/10 pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#12151e] border border-white/10 p-1 text-xs font-mono">
                  {(['all', '3d', 'video', 'graphic', 'interactive'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 uppercase transition-colors cursor-pointer ${categoryFilter === cat ? 'bg-[#00f0ff] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects List */}
              {loadingProjects ? (
                <div className="py-16 text-center text-xs font-mono text-gray-400">
                  Connecting to live Firestore database...
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="py-16 text-center text-xs font-mono text-gray-400 border border-dashed border-white/15 p-8">
                  No projects match your filter. Click "Add Project" above to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProjects.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-[#12151e] border border-white/10 p-4 rounded flex items-start gap-4 group hover:border-[#00f0ff]/50 transition-colors"
                    >
                      {/* Thumbnail with multiple image counter badge */}
                      <div className="w-24 h-24 bg-black rounded overflow-hidden shrink-0 border border-white/10 relative">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = PRESET_IMAGES[0].url;
                          }}
                        />
                        {p.images && p.images.length > 1 && (
                          <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-[#00f0ff] border border-[#00f0ff]/30 flex items-center gap-0.5">
                            <Layers className="w-2.5 h-2.5" />
                            <span>{p.images.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 mb-1">
                          <span className="uppercase text-[#00f0ff] font-bold">{p.category}</span>
                          <span>·</span>
                          <span>{p.year}</span>
                          <span>·</span>
                          <span className="text-[#ffb800] truncate">{p.client}</span>
                        </div>
                        <h4 className="text-sm font-heading font-bold text-white truncate">
                          {p.title}
                        </h4>
                        <p className="text-xs font-mono text-gray-400 line-clamp-2 mt-1">
                          {p.summary}
                        </p>
                        {p.images && p.images.length > 1 && (
                          <div className="mt-2 text-[10px] font-mono text-gray-500 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-[#00f0ff]" />
                            <span>{p.images.length} images in gallery</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          onClick={() => openEditForm(p)}
                          className="p-2 bg-white/5 hover:bg-[#00f0ff] hover:text-black text-gray-300 rounded transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(p.id)}
                          className="p-2 bg-white/5 hover:bg-red-500 hover:text-white text-gray-300 rounded transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal: Add / Edit Form with Single & Multiple Image Upload */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/85"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="w-full max-w-2xl bg-[#0d1017] border border-[#00f0ff] rounded-lg p-6 max-h-[92vh] overflow-y-auto space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-heading font-bold text-white uppercase">
                      {editingId ? 'Edit Project' : 'Add New Portfolio Project'}
                    </h3>
                    <p className="text-[11px] font-mono text-gray-400">
                      Supports single cover image and multiple gallery shots/breakdowns
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-1 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-gray-300 mb-1.5 uppercase tracking-wider">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Cybernetic Exoskeleton 01"
                      className="w-full bg-[#12151e] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-1.5 uppercase tracking-wider">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const cat = e.target.value as '3d' | 'video' | 'graphic' | 'interactive';
                          const option = CATEGORY_OPTIONS.find(o => o.value === cat);
                          setFormData({ 
                            ...formData, 
                            category: cat,
                            categoryLabel: option?.label || cat.toUpperCase()
                          });
                        }}
                        className="w-full bg-[#12151e] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                      >
                        {CATEGORY_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1.5 uppercase tracking-wider">
                        Client / Studio *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        placeholder="e.g. Apex Robotics Lab"
                        className="w-full bg-[#12151e] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-1.5 uppercase tracking-wider">
                        Year *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="2025"
                        className="w-full bg-[#12151e] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>
                  </div>

                  {/* ========================================================
                      IMAGE UPLOAD SYSTEM: Single or Multiple Image Upload
                     ======================================================== */}
                  <div className="space-y-3 bg-[#12151e] border border-white/15 p-4 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-gray-200 uppercase tracking-wider font-bold">
                          Project Images (Single or Multiple) *
                        </label>
                        <p className="text-[11px] text-gray-400">
                          Upload single cover image or multiple breakdown renders from your device.
                        </p>
                      </div>
                      <span className="text-[11px] text-[#00f0ff] font-bold">
                        {formData.images.length} Image{formData.images.length !== 1 ? 's' : ''} Attached
                      </span>
                    </div>

                    {/* Drag and drop upload zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors ${isDragOver ? 'border-[#00f0ff] bg-[#00f0ff]/10' : 'border-white/20 bg-black/40 hover:border-[#00f0ff]'}`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <UploadCloud className="w-8 h-8 text-[#00f0ff] mx-auto mb-2" />
                      <p className="text-white font-medium text-xs">
                        {isOptimizingImages ? 'Optimizing & encoding images...' : 'Click to Upload Images or Drag & Drop Files'}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Select one or multiple images (PNG, JPG, WEBP, SVG). Auto-optimized for instant loading.
                      </p>
                    </div>

                    {/* Image Gallery Preview Grid with Cover Selector */}
                    {formData.images.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <div className="text-[11px] text-gray-400 flex items-center justify-between">
                          <span>Attached Images (Click star to set Cover Image):</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {formData.images.map((imgUrl, index) => {
                            const isCover = formData.image === imgUrl;
                            return (
                              <div
                                key={index}
                                className={`relative group aspect-video rounded overflow-hidden border ${isCover ? 'border-[#00f0ff] ring-1 ring-[#00f0ff]' : 'border-white/10 bg-black'}`}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Attached ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />

                                {/* Cover indicator badge */}
                                {isCover && (
                                  <div className="absolute top-1 left-1 bg-[#00f0ff] text-black text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    <span>COVER</span>
                                  </div>
                                )}

                                {/* Overlay actions */}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  {!isCover && (
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleSetCoverImage(imgUrl); }}
                                      className="p-1.5 bg-[#00f0ff] text-black rounded hover:bg-white transition-colors cursor-pointer"
                                      title="Set as Cover Image"
                                    >
                                      <Star className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                                    className="p-1.5 bg-red-600 text-white rounded hover:bg-red-500 transition-colors cursor-pointer"
                                    title="Remove Image"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Secondary option: Add custom image URL or Preset */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <span className="text-[10px] text-gray-400 block uppercase">
                        Or Add via External URL / Preset:
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="Paste image URL (https://...)..."
                          className="flex-1 bg-black/60 border border-white/15 px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#00f0ff]"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomUrl}
                          className="px-3 py-1.5 bg-white/10 text-white hover:bg-[#00f0ff] hover:text-black transition-colors font-bold"
                        >
                          Add URL
                        </button>
                      </div>

                      {/* Studio Presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-gray-500 self-center mr-1">Studio Presets:</span>
                        {PRESET_IMAGES.map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => handleAddPresetImage(preset.url)}
                            className={`px-2 py-0.5 text-[10px] border transition-colors cursor-pointer ${formData.images.includes(preset.url) ? 'border-[#00f0ff] text-[#00f0ff] bg-[#00f0ff]/10' : 'border-white/10 text-gray-400 hover:text-white'}`}
                          >
                            + {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1.5 uppercase tracking-wider">
                      Tools & Software (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tools}
                      onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                      placeholder="Blender, Unreal Engine 5, Octane Render"
                      className="w-full bg-[#12151e] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1.5 uppercase tracking-wider">
                      Deliverables & Scope (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.deliverables}
                      onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                      placeholder="High-Poly 3D Sculpt, 4K UDIM Textures, Lighting"
                      className="w-full bg-[#12151e] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1.5 uppercase tracking-wider">
                      Case Study Summary *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Detailed overview of the creative approach, geometry, and technical execution..."
                      className="w-full bg-[#12151e] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff] resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="featuredCheck"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#00f0ff]"
                    />
                    <label htmlFor="featuredCheck" className="text-gray-300 cursor-pointer">
                      Featured Highlight in Showreel & Hero
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-white/20 text-gray-300 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isOptimizingImages}
                      className="px-6 py-2 bg-[#00f0ff] text-black font-bold uppercase hover:bg-white transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? 'Saving to Firestore...' : 'Save Project'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal: Delete Confirmation */}
        <AnimatePresence>
          {deletingId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/85"
            >
              <div className="w-full max-w-sm bg-[#0d1017] border border-red-500 rounded p-6 space-y-4 text-center">
                <Trash2 className="w-10 h-10 text-red-400 mx-auto" />
                <h4 className="text-base font-heading font-bold text-white uppercase">
                  Confirm Deletion
                </h4>
                <p className="text-xs font-mono text-gray-300">
                  Are you sure you want to delete this project from the portfolio? This cannot be undone.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="px-4 py-2 text-xs font-mono border border-white/20 text-gray-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteProject(deletingId)}
                    className="px-4 py-2 text-xs font-mono bg-red-600 text-white font-bold hover:bg-red-500 cursor-pointer"
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
