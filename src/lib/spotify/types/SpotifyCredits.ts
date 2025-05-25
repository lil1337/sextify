export type SpotifyCredits = {
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
    extendedSpotifyCredits: any[];
    sourceNames: string[];
};