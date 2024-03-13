export interface Post {
    id: string;
    title: string;
    content: string;
    imagePath: string;
    creator: string;
    ingredients: any;
    process: any;
    likes: number;
  }
  
export interface Ingredients {
  amountOfPeople: number;
  ingredients: {
    name: string;
    amount: string;
  }[];
}

export interface Process {
  difficulty: number;
  timeToPrepare: number;
  timeToCook: number;
  steps: string[];
}