export type SeekTable = {
    seektable_version: string;
    offset: number;
    timescale: number;
    segments: [number, number][];
    encoder_delay_samples: number;
    padding_samples: number;
    init_range: [number, number];
    pssh: string;
    pssh_playready: string;
    pssh_widevine: string;
};