import { GlobalColors } from '@/models'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

interface LayoutPrivateProps {
  children: React.ReactNode
}

const LayoutPrivate: React.FC<LayoutPrivateProps> = ({ children }) => {
  return (
    <>
      <Box
        bg={'#181818'}
        h={'16px'}
        position={'relative'}
        left={0}
        top={0}
        zIndex={50000}></Box>
      <Flex
        flexDirection={'column'}
        justifyContent={'center'}
        alignContent={'center'}
        alignItems={'center'}
        overflowY={'hidden'}>
        <Flex
          display={'column'}
          bg={GlobalColors.BGCONTENT}
          rounded={30}
          h={'auto'}
          overflow={'hidden'}
          borderBottom={'1px solid'}
          borderRight={'1px solid'}
          borderLeft={'1px solid'}
          borderColor={GlobalColors.BORDERCONTENT}
          w={{ base: '100%', md: '70%', lg: '600px' }}>
          {children}
        </Flex>
      </Flex>
    </>
  )
}

export default LayoutPrivate
