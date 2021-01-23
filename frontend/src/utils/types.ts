export interface User {
    _id?: string;
    name: string;
    avatarImage: string;
    email: string;
    role: 'applicant' | 'recruiter';
}

export interface Education {
    instituteName: string;
    startYear: number | '';
    endYear?: number | '';
}

export interface Applicant extends User {
    role: 'applicant';
    ratingMap?: RatingMap;
    education: Education[];
    skills: Array<string>;
}

export interface Recruiter extends User {
    contactNumber: string;
    bio: string;
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
    nApplicants?: number;
    rPositions?: number;
}

export interface Application {
    id: string;
    job: Partial<Job>;
    applicant: Partial<Applicant>;
    sop: string;
    status: 'STB' | 'REJ' | 'SHL' | 'ACC';
    createdAt: Date;
}

export interface EmployeeApplication {
    _id: string;
    id: string;
    applicant: Partial<Applicant>;
    job: Partial<Job>;
    doj: Date;
}
