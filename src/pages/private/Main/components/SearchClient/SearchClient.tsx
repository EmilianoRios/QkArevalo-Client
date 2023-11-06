import { Flex, Input, Text } from '@chakra-ui/react'
import React from 'react'

interface SearchClientProps {
  searchTerm: string
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchClient: React.FC<SearchClientProps> = ({
  searchTerm,
  handleSearch
}) => {
  return (
    <>
      <Flex flexDirection={'column'}>
        <Flex flexDirection={'column'} mb={4}>
          <Text fontSize={'md'} className='chakra-form__label css-79e1m'>
            Buscar:
          </Text>
          <Input
            value={searchTerm}
            onChange={(event) => {
              handleSearch(event)
            }}
            placeholder='Nombre o DNI'
            variant='outline'
          />
        </Flex>
      </Flex>
    </>
  )
}

export default SearchClient
