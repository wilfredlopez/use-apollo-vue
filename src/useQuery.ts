import { reactive, toRefs, UnwrapRef } from 'vue'
import {
  ErrorPolicy,
  ApolloClient,
  NetworkStatus,
  FetchPolicy,
} from 'apollo-boost'
import { DocumentNode } from 'graphql'
import { OperationVariables } from './query-types'
function validatePresence(item: DocumentNode, itemKey: string) {
  if (!item) {
    throw new TypeError(
      `You must provide an argument option for ${itemKey} to 'useQuery'`
    )
  }
}

export interface UseQueryOptions<T, TVariables = OperationVariables> {
  query: DocumentNode
  /**
   * context.root.$apollo
   */
  client: ApolloClient<T>
  pollInterval?: number
  notifyOnNetworkStatusChange?: boolean
  fetchPolicy?: FetchPolicy
  errorPolicy?: ErrorPolicy
  //eslint-disable-next-line
  context?: any
  variables?: TVariables
}

function useQuery<T extends {}, TVariables = OperationVariables>({
  query,
  client,
  pollInterval,
  errorPolicy,
  context,
  variables,
  notifyOnNetworkStatusChange = false,
  fetchPolicy = 'cache-first',
}: UseQueryOptions<T, TVariables>) {
  validatePresence(query, 'query')

  const apolloCurrentResult = reactive({
    data: null,
    error: null,
    loading: true,
    stale: false,
    networkStatus: {},
  }) as {
    data: UnwrapRef<T>
    //eslint-disable-next-line
    error: any
    loading: boolean
    stale: boolean
    networkStatus: NetworkStatus
  }

  const observableQuery = client.watchQuery<T, TVariables>({
    query,
    fetchPolicy,
    errorPolicy,
    context,
    notifyOnNetworkStatusChange,
    pollInterval,
    variables,
  })

  observableQuery.subscribe({
    next(result) {
      //eslint-disable-next-line
      //@ts-ignore
      apolloCurrentResult.data = result.data
      apolloCurrentResult.loading = result.loading
      apolloCurrentResult.networkStatus = result.networkStatus
      apolloCurrentResult.stale = result.stale
      apolloCurrentResult.error = null
    },
    error(error) {
      apolloCurrentResult.loading = false
      apolloCurrentResult.stale = false
      apolloCurrentResult.error = error
    },
  })

  return {
    result: toRefs(apolloCurrentResult),
    query: observableQuery,
    helpers: {
      fetchMore: observableQuery.fetchMore.bind(observableQuery),
      refetch: observableQuery.refetch.bind(observableQuery),
      startPolling: observableQuery.startPolling.bind(observableQuery),
      stopPolling: observableQuery.stopPolling.bind(observableQuery),
      updateQuery: observableQuery.updateQuery.bind(observableQuery),
    },
  }
}

export default useQuery
