export interface Snippet {
    id: string;
    content: string;
    token: string;
    canEdit: boolean;
    createdAt: Date;
    expiresAt?: Date;
  }
  