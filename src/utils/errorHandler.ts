import { toast } from 'sonner';

export enum ErrorType {
  AI_API = 'AI_API',
  NETWORK = 'NETWORK',
  STORAGE = 'STORAGE',
  AUTH = 'AUTH',
  FIRESTORE = 'FIRESTORE',
  AUDIO = 'AUDIO',
  UNKNOWN = 'UNKNOWN',
}

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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
}

export const handleError = (error: any, type: ErrorType = ErrorType.UNKNOWN) => {
  console.error(`[${type}] Error:`, error);

  let userMessage = 'Something went wrong. Please try again.';

  if (type === ErrorType.AI_API) {
    userMessage = 'Our AI is taking a quick nap. Please try again in a moment!';
    if (error?.message?.includes('quota')) {
      userMessage = 'We have reached our daily limit for AI features. Please try again tomorrow.';
    } else if (error?.message?.includes('premium') || error?.message?.includes('Pro')) {
      userMessage = 'This advanced AI feature requires a Premium subscription.';
    }
  } else if (type === ErrorType.NETWORK) {
    userMessage = 'Check your internet connection and try again.';
  } else if (type === ErrorType.STORAGE) {
    userMessage = 'We could not save your progress. Your device might be out of space.';
  } else if (type === ErrorType.AUDIO) {
    userMessage = 'Sound playback failed. Please check your volume or internet connection.';
    if (error?.name === 'NotAllowedError' || error?.message?.includes('Permission denied')) {
      userMessage = 'Microphone access was denied. Please enable it in your browser settings to practice!';
    } else if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
      userMessage = 'We could not find a microphone on this device. Please plug one in and try again.';
    } else if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') {
      userMessage = 'Your microphone is being used by another app. Please close it and try again.';
    } else if (error?.message?.includes('supported source')) {
      userMessage = 'We could not find a supported audio source for this item.';
    } else if (error?.message?.includes('premium') || error?.message?.includes('Pro')) {
      userMessage = 'This audio feature is available for Premium users.';
    } else if (error?.message?.includes('empty audio')) {
      userMessage = 'We didn\'t hear anything! Please make sure your mic is working and try again.';
    } else if (error?.message?.includes('interrupted')) {
      userMessage = 'Recording was interrupted. Please try to stay on this tab while practicing.';
    }
  }

  toast.error(userMessage, {
    description: error instanceof Error ? error.message : undefined,
  });

  return {
    type,
    message: userMessage,
    originalError: error,
  };
};

export const handleSuccess = (message: string) => {
  toast.success(message);
};

export const handleFirestoreError = (error: any, operationType: OperationType, path: string | null, auth: any) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map((provider: any) => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  toast.error('Database Error', {
    description: 'We had trouble connecting to our database. Our team has been notified.'
  });

  throw new Error(JSON.stringify(errInfo));
};
