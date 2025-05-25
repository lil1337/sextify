import { SpotifyCdnFile } from "./SpotifyCdnFile";

export type TrackMetadata = {
    gid: string;
    name: string;
    album: {
        gid: string;
        name: string;
        artist: {
            gid: string;
            name: string;
        }[];
        label: string;
        date: {
            year: number;
            month: number;
            day: number;
        };
        cover_group: {
            image: {
                file_id: string;
                size: 'DEFAULT' | 'SMALL' | 'LARGE';
                width: number;
                height: number;
            }[];
        };
        licensor: {
            uuid: string;
        };
    };
    artist: {
        gid: string;
        name: string;
    }[];
    number: number;
    disc_number: number;
    duration: number;
    popularity: number;
    external_id: {
        type: string;
        id: string;
    }[];
    file: SpotifyCdnFile[];
    preview: {
        file_id: string;
        format: 'MP3_96';
    }[];
    earliest_live_timestamp: number;
    has_lyrics: boolean;
    licensor: {
        uuid: string;
    };
    language_of_performance: string[];
    original_audio: {
        uuid: string;
        format: 'AUDIO_FORMAT_STEREO';
    };
    original_title: string;
    artist_with_role: {
        artist_gid: string;
        artist_name: string;
        role: 'ARTIST_ROLE_MAIN_ARTIST' | 'ARTIST_ROLE_FEATURED_ARTIST';
    }[];
    canonical_uri: string;
    content_authorization_attributes: string;
    audio_formats: {
        original_audio: {
            uuid: string;
            format: 'AUDIO_FORMAT_STEREO';
        };
    }[];
};