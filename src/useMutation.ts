import { reactive, toRefs, UnwrapRef } from 'vue'
import { ErrorPolicy, ApolloClient, FetchPolicy } from 'apollo-boost'
import { DocumentNode, GraphQLError } from 'graphql'

import { OperationVariables } from './query-types'

export interface UseMutationOptions<T, TVariables = OperationVariables> {
  mutation: DocumentNode
  /**
   * context.root.$apollo
   */
  client: ApolloClient<T>
  fetchPolicy?: FetchPolicy
  errorPolicy?: ErrorPolicy
  //eslint-disable-next-line
  context?: any
  variables?: TVariables
}

function useMutation<T extends {}, TVariables = OperationVariables>({
  mutation,
  client,
  errorPolicy,
  context,
  variables,
  fetchPolicy = 'cache-first',
}: UseMutationOptions<T, TVariables>) {
  const apolloCurrentResult = reactive({
    data: null,
    errors: [] as readonly GraphQLError[],
    loading: true,
  }) as {
    data: UnwrapRef<T>
    //eslint-disable-next-line
    errors: readonly GraphQLError[]
    loading: boolean
  }

  const observableMutation = (mutateVariables?: TVariables) => {
    if (mutateVariables) {
      variables = mutateVariables
    }
    return client
      .mutate<T, TVariables>({
        mutation,
        fetchPolicy,
        errorPolicy,
        context,
        variables,
      })
      .then(result => {
        if (result.data) {
          //eslint-disable-next-line
          //@ts-ignore
          apolloCurrentResult.data = result.data
          apolloCurrentResult.loading = false
          apolloCurrentResult.errors = []
        }
        if (result.errors) {
          apolloCurrentResult.errors = result.errors
          apolloCurrentResult.loading = false
        }
      })
  }
  return [observableMutation, toRefs(apolloCurrentResult)] as const
}

export default useMutation
