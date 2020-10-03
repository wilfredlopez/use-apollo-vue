import { gql } from 'apollo-boost'
import createUseQuery from '../createUseQuery'
import { Maybe, Scalars } from '../query-types'

export type SongResponse = {
  __typename?: 'SongResponse'
  songs: Array<Song>
  totalCount: Scalars['Float']
}

export type Song = {
  __typename?: 'Song'
  id: Scalars['ID']
  artist: Scalars['String']
  title: Scalars['String']
  genre: Scalars['String']
  album?: Maybe<Scalars['String']>
  imageUrl: Scalars['String']
  audioUrl: Scalars['String']
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
  name: Scalars['String']
}
export type SongFragmentFragment = { __typename?: 'Song' } & Pick<
  Song,
  'name' | 'imageUrl' | 'audioUrl' | 'id' | 'artist' | 'title' | 'genre'
>

export type SearchSongsQuery = { __typename?: 'Query' } & {
  searchSongs: { __typename?: 'SongResponse' } & Pick<
    SongResponse,
    'totalCount'
  > & {
      songs: Array<{ __typename?: 'Song' } & SongFragmentFragment>
    }
}

export type SearchSongsQueryVariables = {
  query: Scalars['String']
  skip?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
}

export const SearchSongsDocument = gql`
  query SearchSongs($query: String!, $skip: Int, $limit: Int) {
    searchSongs(query: $query, skip: $skip, limit: $limit) {
      totalCount
      songs {
        name
        imageUrl
        audioUrl
        id
        artist
        title
        genre
      }
    }
  }
`

export const [useSearchSongsQuery, useSearchSongsLazyQuery] = createUseQuery<
  SearchSongsQuery,
  SearchSongsQueryVariables
>(SearchSongsDocument)
