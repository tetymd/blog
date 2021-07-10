import { useRef } from "react"
import { ApolloError, MutationFunction, MutationResult, useMutation, useQuery } from "@apollo/client"
import { MutationComponentOptions, QueryComponentOptions } from "@apollo/client/react/components/types"

export const Query = (props: QueryComponentOptions) => {
  const counter = useRef(7)
  const { children, query, ...options } = props

  options.onError = async(error: ApolloError) => {
    console.log('refetching...', counter.current)
    console.log(error)
    counter.current--
    if (counter.current >= 0) await result.refetch()
  }

  const result = useQuery(query, options)
  return (children) && result ? children(result) : null
}

interface MutationOptionWithQueryResultData extends MutationComponentOptions {
  queryResultData: any,
  children: (
    mutateFunction: MutationFunction,
    result: MutationResult,
    queryResultData?: any
  ) => JSX.Element | null;
}

export const Mutation = (props: MutationOptionWithQueryResultData) => {
  const { children, queryResultData, ...options } = props
  const [runMutation, result] = useMutation(props.mutation, options);
  return children ? children(runMutation, result, queryResultData) : null;
}