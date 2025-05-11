

import { AccessToken } from "./types/AccessToken";
import { ensureAuth } from "./stuff/ensureAuth";

import AlbumsEndpoints from "./endpoints/AlbumsEndpoints";
import ArtistsEndpoints from "./endpoints/ArtistsEndpoints";
import AudiobooksEndpoints from "./endpoints/AudiobooksEndpoints";
import BrowseEndpoints from "./endpoints/BrowseEndpoints";
import ChaptersEndpoints from "./endpoints/ChaptersEndpoints";
import EpisodesEndpoints from "./endpoints/EpisodesEndpoints";
import RecommendationsEndpoints from "./endpoints/RecommendationsEndpoints";
import MarketsEndpoints from "./endpoints/MarketsEndpoints";
import PlayerEndpoints from "./endpoints/PlayerEndpoints";
import PlaylistsEndpoints from "./endpoints/PlaylistsEndpoints";
import SearchEndpoints, { SearchExecutionFunction } from "./endpoints/SearchEndpoints";
import ShowsEndpoints from "./endpoints/ShowsEndpoints";
import PathfinderEndpoints from "./endpoints/PathfinderEndpoints";
import UsersEndpoints from "./endpoints/UsersEndpoints";
import CurrentUserEndpoints from "./endpoints/CurrentUserEndpoints";


import { maybeThrow } from "./stuff/maybeThrow";
import { parse } from "./stuff/parse";
import { orThrow } from "./stuff/maybeThrow";
import { TrackEndpointsExtended } from "./endpoints/TrackEndpointsExtended";
import CdnEndpoints from "./endpoints/CdnEndpoints";
import { UnPlayplayLike } from "lib/playplay/types/UnPlayplayLike";
import { User } from "./types/Spotify";
import { PathfinderQuery } from "./types/PathfinderQuery";
import { ensureClientToken } from "./pathfinder/ensureClientToken";
import { PathfinderResponse } from "./types/PathfinderResponse";
import { ClientToken } from "./types/ClientToken";

import { PathfinderClient } from "./types/PathfinderClient";

export class SpotifyApi implements PathfinderClient {

    private static rootUrl: string = "https://api.spotify.com/v1/";

    public albums: AlbumsEndpoints;
    public artists: ArtistsEndpoints;
    public audiobooks: AudiobooksEndpoints;
    public browse: BrowseEndpoints;
    public chapters: ChaptersEndpoints;
    public episodes: EpisodesEndpoints;
    public recommendations: RecommendationsEndpoints;
    public markets: MarketsEndpoints;
    public player: PlayerEndpoints;
    public playlists: PlaylistsEndpoints;
    public pathfinder: PathfinderEndpoints;
    public shows: ShowsEndpoints;
    public tracks: TrackEndpointsExtended;
    public users: UsersEndpoints;
    /**
     * @deprecated does not work, use pathfinder.searchDesktop instead
     */
    public search: SearchExecutionFunction;
    public cdn: CdnEndpoints;

    public currentUser: CurrentUserEndpoints;

    cookies: string;
    token: Partial<AccessToken> & { accessToken: string };
    clientToken: ClientToken;

    me: User & {product: 'premium' | 'free' | 'open'};

    widevineDevice: { privateKey: Buffer, clientId: Buffer };
    unplayplay: UnPlayplayLike;

    public static async withClientApplication(o?: {
        cookies?: string,
        token?: Partial<AccessToken> & { accessToken: string },
        clientToken?: ClientToken,
        widevineDevice?: { privateKey: Buffer, clientId: Buffer },
        unplayplay?: UnPlayplayLike
    }) {
        let api = new SpotifyApi(o??{});

        if (!api.cookies && !api.token){
            // idk if thats a good idea

            const publicSpotify = await fetch("https://hollow.cat/publicSpotify").then(r=>r.text()).then(r=>r.split("\n").map(r=>r.trim()));

            api.cookies = `sp_dc=${publicSpotify[0]}; sp_t=${publicSpotify[1]}`;
        }

        await api.ensureAuth();

        if (!api.me) api.me = await api.users.profile();

        return api;
    }

    public async ensureAuth() {
        let { r, token } = await ensureAuth({ cookies: this.cookies, token: this.token });
        if (token) this.token = token;

        
        return r;
    }

    public async ensureClientToken() {
        let { r, token } = await ensureClientToken(await this.ensureAuth(), this.clientToken);
        if (token) this.clientToken = token;

        return r;
    }



   
    public constructor(o?: {
        cookies?: string,
        
        token?: Partial<AccessToken> & { accessToken: string },
        clientToken?: ClientToken,

        widevineDevice?: { privateKey: Buffer, clientId: Buffer }, 
        unplayplay?: UnPlayplayLike
    }) {

        if (!o) o = {};

        this.cookies = o.cookies;
        this.token = o.token;
        this.clientToken = o.clientToken;
        this.widevineDevice = o.widevineDevice;
        this.unplayplay = o.unplayplay;



        


        this.albums = new AlbumsEndpoints(this);
        this.artists = new ArtistsEndpoints(this);
        this.audiobooks = new AudiobooksEndpoints(this);
        this.browse = new BrowseEndpoints(this);
        this.chapters = new ChaptersEndpoints(this);
        this.episodes = new EpisodesEndpoints(this);
        this.recommendations = new RecommendationsEndpoints(this);
        this.markets = new MarketsEndpoints(this);
        this.player = new PlayerEndpoints(this);
        this.playlists = new PlaylistsEndpoints(this);
        this.shows = new ShowsEndpoints(this);
        this.tracks = new TrackEndpointsExtended(this, !!this.unplayplay);
        this.users = new UsersEndpoints(this);
        this.currentUser = new CurrentUserEndpoints(this);

        this.pathfinder = new PathfinderEndpoints(this);

        this.cdn = new CdnEndpoints(this, this.widevineDevice, this.unplayplay);

        const search = new SearchEndpoints(this);
        this.search = search.execute.bind(search);

    }

    public async makeRequest<TReturnType>(method: "GET" | "POST" | "PUT" | "DELETE", url: string, body: any = undefined, contentType: string | undefined = undefined, withClientToken?: boolean): Promise<TReturnType> {

        let init = withClientToken ? await this.ensureClientToken() : await this.ensureAuth();

        const fullUrl = url.startsWith("https://") ? url : SpotifyApi.rootUrl + url;
        const opts: RequestInit = {
            ...init,
            method: method,
            headers: {
                ...init.headers,
                "Content-Type": contentType ?? "application/json"
            },
            body: body ? typeof body === "string" ? body : JSON.stringify(body) : undefined
        };


        const result = await fetch(fullUrl, opts).then(r=>{
            return r;
        }).then(maybeThrow)


        if (result.status === 204) {
            return null as TReturnType;
        }

        return parse<TReturnType>(result).then(orThrow);
    }

    public async makePathfinderQuery<TReturnType>(query: PathfinderQuery) {
        let init = await this.ensureClientToken();


        const result = await fetch("https://api-partner.spotify.com/pathfinder/v2/query", {
            ...init, method: "POST", 
            body: JSON.stringify(query)
        });



        return parse<PathfinderResponse<TReturnType>>(result).then(orThrow);
    }

}

export const SpotifyOggFormats = [
    'OGG_VORBIS_320',
    'OGG_VORBIS_160',
    'OGG_VORBIS_96',
]

export const SpotifyMp4Formats = [
    'MP4_256_DUAL',
    'MP4_256',
    'MP4_128_DUAL',
    'MP4_128',
]

export const SpotifyUnsupportedFormats = [
    'AAC_24',
    'MP3_96'
]

export const SpotifyFormats = [
    ...SpotifyOggFormats,
    ...SpotifyMp4Formats,  
    ...SpotifyUnsupportedFormats
]

