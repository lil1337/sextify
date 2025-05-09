export type LyricLine = {
    startTimeMs: string;
    words: string;
    syllables: string[];
    endTimeMs: string;
};

export type Lyrics = {
    lyrics: {
        syncType: string;
        lines: LyricLine[];
        provider: string;
        providerLyricsId: string;
        providerDisplayName: string;
        syncLyricsUri: string;
        isDenseTypeface: boolean;
        alternatives: any[];
        language: string;
        isRtlLanguage: boolean;
        capStatus: string;
        previewLines: LyricLine[];
    };
    colors: {
        background: number;
        text: number;
        highlightText: number;
    };
    hasVocalRemoval: boolean;
};