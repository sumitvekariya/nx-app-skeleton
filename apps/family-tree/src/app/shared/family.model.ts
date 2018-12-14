export interface Person {
  firstName: string;
  middleName: string;
  lastName: string;
  age: number;
  sex: 'male' | 'female';
  number: string;
  birthDate: Date;
  alive: boolean;
  deathDate: Date;
  children: Person[];
  dad: string;
  mom: string;
  _id: string;
}

export interface Family {
  name: string;
  persons: Person[];
  _id: string;
}
