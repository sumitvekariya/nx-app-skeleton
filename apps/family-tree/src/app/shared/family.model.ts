export interface Person {
  firstName: string;
  middleName: string;
  lastName: string;
  age: number;
  birthDate: Date;
  alive: boolean;
  deathDate: Date;
  children: Person[];
  dad: Person;
  mom: Person;
  _id: string;
}

export interface Family {
  name: string;
  persons: Person[];
  _id: string;
}
