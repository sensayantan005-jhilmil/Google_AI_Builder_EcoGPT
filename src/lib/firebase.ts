/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Firebase & Cloud Firestore Client for EcoGPT
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore using the specific database ID configured for the app
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ============================================================================
// Operation Types & Secure Error Handling
// ============================================================================

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ============================================================================
// Test Connection on Boot
// ============================================================================

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore: client is currently offline or unreachable.');
    }
    // Connection test is benign; return false on error
    return false;
  }
}

// Auto-run connection diagnostic
testFirestoreConnection();

// ============================================================================
// Authentication Services
// ============================================================================

export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Sync / persist user profile document in Firestore
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return result.user;
  } catch (error) {
    console.error('Sign-in failed:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out failed:', error);
    throw error;
  }
}

export async function syncUserProfile(user: User): Promise<void> {
  const userPath = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Eco Explorer',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

// ============================================================================
// Persistent Saved Assessments & Masterplans
// ============================================================================

export interface SavedAssessmentRecord {
  id: string;
  userId: string;
  city: string;
  country: string;
  aqiScore: number;
  aqiCategory?: string;
  treeTarget: number;
  roofArea?: number;
  co2AbsorbedTons?: number;
  harvestLiters?: number;
  uhiCoolingC?: number;
  summary?: string;
  createdAt: string;
}

export async function saveAssessmentToFirestore(
  assessment: Omit<SavedAssessmentRecord, 'id' | 'userId' | 'createdAt'>
): Promise<SavedAssessmentRecord> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Must be signed in to save assessments.');
  }

  const id = `asmt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record: SavedAssessmentRecord = {
    ...assessment,
    id,
    userId: currentUser.uid,
    createdAt: new Date().toISOString(),
  };

  const path = `savedAssessments/${id}`;
  try {
    const docRef = doc(db, 'savedAssessments', id);
    await setDoc(docRef, record);
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeUserSavedAssessments(
  userId: string,
  onUpdate: (assessments: SavedAssessmentRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'savedAssessments';
  const q = query(collection(db, path), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: SavedAssessmentRecord[] = [];
      snapshot.forEach((d) => {
        records.push(d.data() as SavedAssessmentRecord);
      });
      // Sort newest first
      records.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      onUpdate(records);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function deleteSavedAssessment(id: string): Promise<void> {
  const path = `savedAssessments/${id}`;
  try {
    await deleteDoc(doc(db, 'savedAssessments', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
