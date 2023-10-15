import { GlobalColors } from '@/models'
import { Flex } from '@chakra-ui/react'
import React from 'react'

interface LayoutPrivateProps {
  children: React.ReactNode
}

const LayoutPrivate: React.FC<LayoutPrivateProps> = ({ children }) => {
  return (
    <Flex
      flexDirection={'column'}
      justifyContent={'center'}
      alignContent={'center'}
      alignItems={'center'}
      pt={4}>
      <Flex
        display={'column'}
        border='1px solid'
        bg={GlobalColors.BGCONTENT}
        rounded={20}
        h={'auto'}
        borderColor={GlobalColors.BORDERCONTENT}
        w={{ base: '90%', md: '70%', lg: '600px' }}>
        {children}
      </Flex>
    </Flex>
  )
}

export default LayoutPrivate
