export interface CollaboratorInfo {
    id: string;
    name: string;
    color: string;
  }
  
  export interface ClipboardContent {
    content: string;
    token: string;
    expiresAt: Date;
  }