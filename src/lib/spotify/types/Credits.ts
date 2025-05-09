export type Credits = {
    trackUri: string;
    trackTitle: string;
    roleCredits: {
        roleTitle: string;
        artists: {
            uri: string;
            name: string;
            imageUri: string;
            subroles: string[];
            weight: number;
        }[];
    }[];
    extendedCredits: any[];
    sourceNames: string[];
};