/* import { LogOut } from '@/components' */
import { Flex, Heading, List, ListItem } from '@chakra-ui/react'
import React from 'react'
import { LogOut } from '@/components'

interface NavbarPrivateProps {
  title: string
}

const NavbarPrivate: React.FC<NavbarPrivateProps> = ({ title }) => {
  return (
    <Flex justifyContent='space-between' w='100%' transition='0.2s'>
      <Heading
        as='h3'
        id='principalTitle'
        ml={4}
        pt={4}
        fontSize={{ base: '1.2rem', sm: '1.2rem', md: '1.2rem', lg: '34px' }}>
        {title}
      </Heading>
      <Flex
        borderRadius={'0px 20px 0px 20px'}
        p={{ base: 3, sm: 3, md: 3, lg: 6 }}
        bg={'whiteAlpha.100'}
        color={'white'}
        justifyContent='center'
        bottom={0}
        left={0}
        zIndex={1}>
        <List
          display='flex'
          alignItems='center'
          gap={4}
          fontSize={{ base: '0.81rem', sm: '0.85rem', lg: 'unset' }}>
          <ListItem>
            <LogOut />
          </ListItem>
        </List>
      </Flex>
    </Flex>
  )
}

export default NavbarPrivate
