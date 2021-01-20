export interface Job {
    id: string;
    recruiterName: string;
    name: string;
    maxApplications: number;
    maxPositions: number;
    applicationDeadline: Date;
    requiredSkills: Array<string>;
    jobType: 'PT' | 'FT' | 'WFH';
    duration: number;
    salary: number;
    rating: number;
}
