// Snapshot of the user's real Spotify taste profile, pulled live via the Spotify
// connector (top tracks, top artists, and taste-based recommendations).
// Genre tags are hand-classified per track/artist and drive every derived view
// (genre cloud, Explore reasons, DJ queue, FM stations).

const SNAPSHOT_PULLED_AT = "2026-09-14";

const TOP_TRACKS = [
  {
    id: "5nmr0qCA3JXN2MRdEDUFi6",
    title: "Deep In My Soul",
    version: "Original Mix",
    artists: ["16BL"],
    album: "Deep In My Soul EP",
    cover: "https://i.scdn.co/image/ab67616d0000b273aa3c09a86829ef55cbd21000",
    preview: "https://p.scdn.co/mp3-preview/522e2b02714b1b0e42c0f2834f1c76a4552a8995.mp3",
    url: "https://open.spotify.com/track/5nmr0qCA3JXN2MRdEDUFi6",
    genres: ["Melodic House & Techno", "Deep House"],
    saved: true,
  },
  {
    id: "4bhSrX2y75cQeATsOjh2pm",
    title: "Weak Signal",
    artists: ["Mild Minds"],
    album: "SWIM",
    cover: "https://i.scdn.co/image/ab67616d0000b27377fddea8194736180fd4055d",
    preview: "https://p.scdn.co/mp3-preview/c7b5f2a4a72514384acd436dfda3094b02c9327e.mp3",
    url: "https://open.spotify.com/track/4bhSrX2y75cQeATsOjh2pm",
    genres: ["Indie Dance", "Organic House"],
    saved: false,
  },
  {
    id: "6smfOFjNAXrrzaMVUg4Hfr",
    title: "Remember Me",
    artists: ["Cornucopia"],
    album: "Remember Me / Early Morning",
    cover: "https://i.scdn.co/image/ab67616d0000b2732ffb66d98cd283ce461bc425",
    preview: "https://p.scdn.co/mp3-preview/85b0a35d6e72b101406ef501b68c4fb8ec6ace54.mp3",
    url: "https://open.spotify.com/track/6smfOFjNAXrrzaMVUg4Hfr",
    genres: ["Organic House", "Melodic House & Techno"],
    saved: true,
  },
  {
    id: "5sVrb7EJxs2LriI1m3KuX2",
    title: "just say dat",
    artists: ["Gunna"],
    album: "The Last Wun",
    cover: "https://i.scdn.co/image/ab67616d0000b27303a253cffd6d9e556ef4eec5",
    preview: "https://p.scdn.co/mp3-preview/e0b41a327c0de82390596b8a1862878783a37d8a.mp3",
    url: "https://open.spotify.com/track/5sVrb7EJxs2LriI1m3KuX2",
    genres: ["Trap", "Hip-Hop"],
    saved: true,
    explicit: true,
  },
  {
    id: "7yKYT061sKZ7vGChQzgcJI",
    title: "Beautiful Life",
    version: "Original Mix",
    artists: ["Martin Roth"],
    album: "Beautiful Life / Make Love To Me Baby",
    cover: "https://i.scdn.co/image/ab67616d0000b2730442d388512aed9f02292b95",
    preview: "https://p.scdn.co/mp3-preview/5677b55a42c77fdbb8197bb4f7919e27ebf43787.mp3",
    url: "https://open.spotify.com/track/7yKYT061sKZ7vGChQzgcJI",
    genres: ["Melodic House & Techno", "Progressive House"],
    saved: true,
  },
];

const TOP_ARTISTS = [
  {
    id: "0u2qG4roqULELVVO9fMgSG",
    name: "16BL",
    image: "https://i.scdn.co/image/ab6761610000e5eb8329e453bbe1c40508ba0021",
    url: "https://open.spotify.com/artist/0u2qG4roqULELVVO9fMgSG",
    genres: ["Melodic House & Techno", "Deep House"],
    following: false,
  },
  {
    id: "2hlmm7s2ICUX0LVIhVFlZQ",
    name: "Gunna",
    image: "https://i.scdn.co/image/ab6761610000e5eba998bc86f87b9fe7e2466110",
    url: "https://open.spotify.com/artist/2hlmm7s2ICUX0LVIhVFlZQ",
    genres: ["Trap", "Hip-Hop"],
    following: false,
  },
  {
    id: "5Nzul0jB2OCPX7vmCFoJXD",
    name: "dublon",
    image: "https://i.scdn.co/image/ab6761610000e5eb47156a71a2ddace5fc7c5537",
    url: "https://open.spotify.com/artist/5Nzul0jB2OCPX7vmCFoJXD",
    genres: ["Melodic House & Techno"],
    following: true,
  },
  {
    id: "3Ka3k9K2WStR52UJVtbJZW",
    name: "Mild Minds",
    image: "https://i.scdn.co/image/ab6761610000e5ebaeb41338520b9c4134bbca3d",
    url: "https://open.spotify.com/artist/3Ka3k9K2WStR52UJVtbJZW",
    genres: ["Indie Dance", "Organic House"],
    following: false,
  },
  {
    id: "66NUn0HlKouyshMUZoiKKW",
    name: "Cornucopia",
    image: "https://i.scdn.co/image/ab67616d0000b273e2f88ffebb424f3f37d55d0c",
    url: "https://open.spotify.com/artist/66NUn0HlKouyshMUZoiKKW",
    genres: ["Organic House", "Melodic House & Techno"],
    following: false,
  },
];

// Taste-based recommendations pulled from the Spotify connector, used to seed
// Explore, DJ and FM with tracks that are new to the listener but close to
// their profile.
const DISCOVERY_TRACKS = [
  {
    id: "3TMk1r1E9iz60vvsRXtNU2",
    title: "Claire",
    artists: ["Clarian", "Guy Gerber"],
    album: "Chemical Gardens EP",
    cover: "https://i.scdn.co/image/ab67616d0000b2733040a2b82a47894785e8e431",
    preview: "https://p.scdn.co/mp3-preview/fc511e08bc7131bf3c76debd1ed5b7a5a11f95a7.mp3",
    url: "https://open.spotify.com/track/3TMk1r1E9iz60vvsRXtNU2",
    genres: ["Melodic House & Techno"],
    because: "You listen to 16BL and dublon",
  },
  {
    id: "3Of0ZixrQPzq22I4ogG4TB",
    title: "Got This Feeling",
    version: "Original Mix",
    artists: ["Cubicolor"],
    album: "Got This Feeling EP",
    cover: "https://i.scdn.co/image/ab67616d0000b273bef05e7324f17209f1de6a59",
    preview: "https://p.scdn.co/mp3-preview/d47319e052e5c130a469f4c86cdfa56134caedd8.mp3",
    url: "https://open.spotify.com/track/3Of0ZixrQPzq22I4ogG4TB",
    genres: ["Melodic House & Techno", "Progressive House"],
    because: "Close to Martin Roth's Beautiful Life",
  },
  {
    id: "2tzT3i3AofX2OAjdGJdBhw",
    title: "Far Away Place",
    version: "Jody Wisternoff & James Grant Remix",
    artists: ["Xinobi", "James Grant", "Jody Wisternoff"],
    album: "Far Away Place (Remix)",
    cover: "https://i.scdn.co/image/ab67616d0000b2739ccdcdf00d34706d6c700e50",
    preview: "https://p.scdn.co/mp3-preview/668e5b8f9ea1488fd46c74ffdcd710360f443813.mp3",
    url: "https://open.spotify.com/track/2tzT3i3AofX2OAjdGJdBhw",
    genres: ["Progressive House", "Organic House"],
    because: "Shares the Organic House thread from Cornucopia",
  },
  {
    id: "0L6InHFc1gn1pOXC6WKbh7",
    title: "Many Rivers",
    artists: ["Booka Shade"],
    album: "Eve",
    cover: "https://i.scdn.co/image/ab67616d0000b273733985c2d26b88c73f412bb5",
    preview: "https://p.scdn.co/mp3-preview/5f79ca14c4cfc6883aa0313995bf668a38c573aa.mp3",
    url: "https://open.spotify.com/track/0L6InHFc1gn1pOXC6WKbh7",
    genres: ["Melodic House & Techno"],
    because: "A deeper cut in your #1 genre",
  },
  {
    id: "2IpfiNS4x20FJ5qKTHWaJ3",
    title: "Diamonds",
    artists: ["Lane 8", "Solomon Grey"],
    album: "Rise",
    cover: "https://i.scdn.co/image/ab67616d0000b2733a96d81732160b2056fe4f39",
    preview: "https://p.scdn.co/mp3-preview/eb68bb91e50396bbbd347a8c23fa63d787f6bba0.mp3",
    url: "https://open.spotify.com/track/2IpfiNS4x20FJ5qKTHWaJ3",
    genres: ["Progressive House", "Organic House"],
    because: "Pairs Mild Minds' warmth with your house streak",
  },
];

// Real, live Spotify AI-generated playlists matching the listener's genre
// clusters, used as "listen in full on Spotify" links from the FM tab.
const STATION_PLAYLISTS = {
  "Melodic House & Techno": "https://open.spotify.com/playlist/7x6lOPWtuSq4KiqPD1oqc7",
  "Organic House": "https://open.spotify.com/playlist/1Bgki3GqoDGnX6gvck5CRj",
  "Deep House": "https://open.spotify.com/playlist/5B8Y3XSNIfkU1Gh2uOIrMs",
  "Trap": "https://open.spotify.com/playlist/0myiuZYo4Xlc6hfaswtHAg",
  "Progressive House": "https://open.spotify.com/playlist/0mBWsOWlEOgcWVgYegnqRq",
  "Discovery": "https://open.spotify.com/playlist/7liDKyhCgfNnmvcNEqK9lp",
};
