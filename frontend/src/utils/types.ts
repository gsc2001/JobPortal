export interface User {
    name: string;
    avatarImage: string;
    email: string;
    role: 'applicant' | 'recruiter';
}

export interface RatingMap {
    [index: string]: number;
}

export interface Job {
    _id: string;
    id: string;
    recruiter: Partial<User>;
    name: string;
    maxApplications: number;
    maxPositions: number;
    applicationDeadline: Date;
    requiredSkills: Array<string>;
    jobType: 'PT' | 'FT' | 'WFH';
    duration: number;
    salary: number;
    ratingMap: RatingMap;
}

export interface Application {
    id: string;
    job: Partial<Job>;
    applicant: Partial<User>;
    sop: string;
    status: 'STB' | 'REJ' | 'SHL' | 'ACC';
    createdAt: Date;
}
