export interface User {
  _id: string;
  username: string;
  email: string;
  reputation: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  _id: string;
  title: string;
  body: string;
  tags: string[];
  author: User;
  votes: number;
  views: number;
  answers: Answer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  _id: string;
  body: string;
  author: User;
  question: string;
  votes: number;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  body: string;
  author: User;
  parentId: string;
  parentType: "question" | "answer";
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  _id: string;
  name: string;
  description: string;
  questionsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  url?: string;
  file?: File;
  publicId?: string;
}

export interface ImageUploadProps {
  images: Image[];
  onImagesChange: (images: Image[]) => void;
  onRemove: (index: number) => void;
  maxImages?: number;
}
