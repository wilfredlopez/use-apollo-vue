## use-apollo-vue

### `useQuery`

```html
<script lang="ts">
  import { useQuery } from 'use-apollo-vue'
  import { inject } from 'vue'
  import gql from 'graphql-tag'
  import { ApolloClient } from 'apollo-boost'

  const FEED_QUERY = gql`
    query getFeed($type: FeedType!, $offset: Int, $limit: Int) {
      currentUser {
        login
      }
      feed(type: $type, offset: $offset, limit: $limit) {
        id
        # ...
      }
    }
  `

  export default {
    props: ['type'],

    setup(props) {
      const client = inject('apollo') as ApolloClient<any>
      const { result } = useQuery({
        client: client,
        query: FEED_QUERY,
        variables: {
          type: props.type,
        },
      })

      return {
        result,
      }
    },
  }
</script>
```

### `createUseQuery` - Create Reusable hooks with type safety.

> useSearchSongs.ts

```ts
import { gql } from 'apollo-boost'
import { createUseQuery, Maybe, Scalars } from 'use-apollo-vue'

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
```

> Search.vue

```html
<template>
  <div class="search">
    <form @submit.prevent="search" class="search-form">
      <div class="form-control">
        <div class="search-input">
          <svg
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
            viewBox="0 0 512 512"
          >
            <path
              d="M464 428L339.92 303.9a160.48 160.48 0 0030.72-94.58C370.64 120.37 298.27 48 209.32 48S48 120.37 48 209.32s72.37 161.32 161.32 161.32a160.48 160.48 0 0094.58-30.72L428 464zM209.32 319.69a110.38 110.38 0 11110.37-110.37 110.5 110.5 0 01-110.37 110.37z"
            ></path>
          </svg>
          <input
            type="text"
            v-model="query"
            placeholder="Song name, artist or album"
          />
        </div>
      </div>
    </form>
    <div v-if="result.length > 0" class="song-grid-container">
      <ul class="song-grid">
        <li v-for="song of result" :key="song.id" :song="song">
          {{ song.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, inject, ref } from 'vue'
  import { useSearchSongsLazyQuery, Song } from './useSearchSongs'
  import { ApolloClient } from 'apollo-boost'

  export default defineComponent({
    setup() {
      // eslint-disable-next-line
      const apollo = inject('apollo') as ApolloClient<any>
      const query = ref('')
      const [
        execQuery,
        {
          result: { data, loading },
        },
      ] = useSearchSongsLazyQuery(apollo)

      function search() {
        execQuery({
          query: query.value,
          limit: 20,
        })
      }

      const result = computed(function () {
        if (data && data.value && data.value.searchSongs) {
          return data.value.searchSongs.songs
        }
        return [] as Song[]
      })

      return {
        search,
        query,
        result,
        loading,
      }
    },
  })
</script>
```
