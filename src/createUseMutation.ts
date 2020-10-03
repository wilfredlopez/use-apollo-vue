import { UseQueryOptions } from './useQuery'
import { ApolloClient } from 'apollo-boost'
import { DocumentNode } from 'graphql'
import useMutation from './useMutation'

export default function createUseMutation<
  MutationType extends {},
  MutationTypeVariables extends {}
>(queryDocument: DocumentNode) {
  const useCustomMutation = (
    client: ApolloClient<MutationType>,
    baseOptions?: Omit<
      UseQueryOptions<MutationType, MutationTypeVariables>,
      'query' | 'client'
    >
  ) => {
    return useMutation<MutationType, MutationTypeVariables>({
      ...baseOptions,
      mutation: queryDocument,
      client: client,
    })
  }

  return useCustomMutation
}
