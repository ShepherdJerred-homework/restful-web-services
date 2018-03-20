export let serverPort: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

export let mongodbUrl: string = 'mongodb://localhost:32768/project3';

export let debug: boolean = true;
