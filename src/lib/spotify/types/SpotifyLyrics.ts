export type SpotifyLyricLine = {
    startTimeMs: string;
    words: string;
    syllables: string[];
    endTimeMs: string;
};

export type SpotifyLyrics = {
    lyrics: {
        syncType: string;
        lines: SpotifyLyricLine[];
        provider: string;
        providerSpotifyLyricsId: string;
        providerDisplayName: string;
        syncSpotifyLyricsUri: string;
        isDenseTypeface: boolean;
        alternatives: any[];
        language: string;
        isRtlLanguage: boolean;
        capStatus: string;
        previewLines: SpotifyLyricLine[];
    };
    colors: {
        background: number;
        text: number;
        highlightText: number;
    };
    hasVocalRemoval: boolean;
};