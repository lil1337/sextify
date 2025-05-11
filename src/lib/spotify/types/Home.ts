// i fw ai generated type declarations so much

export interface Home {
  data: {
    home: HomeResponsePayloadHome;
  };
}

export interface HomeResponsePayloadHome {
  greeting: GreetingHome;
  sectionContainer: SectionContainerHome;
}

export interface GreetingHome {
  transformedLabel: string;
  translatedBaseText: string;
}

export interface SectionContainerHome {
  sections: {
    items: SectionHome[];
  };
}

export interface SectionHome {
  data: SectionDataHome;
  sectionItems: SectionItemsHome;
  uri: string;
}

export type SectionDataHome = HomeShortsSectionDataHome | HomeGenericSectionDataHome;

export interface HomeShortsSectionDataHome {
  __typename: 'HomeShortsSectionData';
}

export interface HomeGenericSectionDataHome {
  __typename: 'HomeGenericSectionData';
  headerEntity: { __typename: string };
  subtitle: LabelHome;
  title: LabelHome;
}

export interface LabelHome {
  transformedLabel: string;
  translatedBaseText: string | null;
}

export interface SectionItemsHome {
  items: SectionItemHome[];
  pagingInfo: {
    nextOffset: number | null;
  };
  totalCount: number;
}

export interface SectionItemHome {
  content: ContentWrapperHome;
  data: any;
  uri: string;
}

export type ContentWrapperHome =
  | UnknownContentWrapperHome
  | AlbumResponseWrapperHome
  | PlaylistResponseWrapperHome
  | ArtistResponseWrapperHome;

export interface UnknownContentWrapperHome {
  __typename: 'UnknownType';
  uri: string;
}

export interface AlbumResponseWrapperHome {
  __typename: 'AlbumResponseWrapper';
  data: AlbumHome;
}

export interface AlbumHome {
  __typename: 'Album';
  name: string;
  uri: string;
  albumType: string;
  playability: PlayabilityHome;
  artists: {
    items: ArtistRefHome[];
  };
  coverArt: CoverArtHome;
}

export interface PlaylistResponseWrapperHome {
  __typename: 'PlaylistResponseWrapper';
  data: PlaylistHome | { __typename: 'NotFound' };
}

export interface PlaylistHome {
  __typename: 'Playlist';
  name: string;
  uri: string;
  description: string;
  format: string;
  attributes: KeyValueHome[];
  images: ImagesHome;
  ownerV2: {
    data: UserHome;
  };
}

export interface ArtistResponseWrapperHome {
  __typename: 'ArtistResponseWrapper';
  data: ArtistHome;
}

export interface ArtistHome {
  __typename: 'Artist';
  profile: {
    name: string;
  };
  uri: string;
  visuals: {
    avatarImage: CoverImageHome;
  };
}

export interface ArtistRefHome {
  profile: {
    name: string;
  };
  uri: string;
}

export interface PlayabilityHome {
  playable: boolean;
  reason: string;
}

export interface CoverArtHome {
  extractedColors: {
    colorDark: ColorHexHome;
  };
  sources: CoverImageHome[];
}

export interface CoverImageHome {
  height: number | null;
  width: number | null;
  url: string;
}

export interface ImagesHome {
  items: {
    extractedColors: {
      colorDark: ColorHexHome;
    };
    sources: CoverImageHome[];
  }[];
}

export interface ColorHexHome {
  hex: string;
  isFallback: boolean;
}

export interface KeyValueHome {
  key: string;
  value: string;
}

export interface UserHome {
  __typename: 'User';
  name: string;
  uri: string;
}