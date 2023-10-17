/* import { LogOut } from '@/components' */
import { LogOut } from '@/components'
import { GlobalColors, StatusClient } from '@/models'
import { updateAllStatusClientsForEmployeeService } from '@/services'
import {
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { BiMenu } from 'react-icons/bi'
import { useSelector } from 'react-redux'

type StateUpdateList = boolean

interface NavbarPrivateProps {
  title: string
  user: string
  setStateUpdateList: React.Dispatch<React.SetStateAction<StateUpdateList>>
}

const NavbarPrivate: React.FC<NavbarPrivateProps> = ({
  title,
  user,
  setStateUpdateList
}) => {
  const authState = useSelector((state: { user: { id: string } }) => state.user)
  return (
    <Flex justifyContent='space-between' w='100%' transition='0.2s'>
      <Flex justifyContent={'center'} alignItems={'center'}>
        <Flex flexDirection={'column'}>
          <Heading
            as='h3'
            id='principalTitle'
            ml={4}
            pt={4}
            fontSize={{
              base: '1.2rem',
              sm: '1.2rem',
              md: '1.2rem',
              lg: '34px'
            }}>
            {title}
          </Heading>
          <Text ml={4}>{user}</Text>
        </Flex>
      </Flex>
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
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<BiMenu />}
                variant='ghost'
              />
              <MenuList bg={GlobalColors.BORDERCONTENT}>
                <Flex px={2} flexDirection={'column'}>
                  <Flex
                    bg={GlobalColors.BGRADIENTDEFAULT}
                    borderRadius={4}
                    py={1}
                    px={3}>
                    <LogOut />
                  </Flex>
                  <MenuDivider />
                  <MenuItem
                    bg={GlobalColors.BGRADIENTDEFAULT}
                    borderRadius={4}
                    onClick={() => {
                      updateAllStatusClientsForEmployeeService({
                        employeeId: authState.id,
                        status: `${StatusClient.DEFAULT}`
                      })
                      setStateUpdateList(true)
                    }}>
                    Restablecer todos los estados
                  </MenuItem>
                </Flex>
                <MenuDivider />
                <MenuItem bgGradient={GlobalColors.WARNINGCOLOR}>
                  Eliminar mis clientes
                </MenuItem>
              </MenuList>
            </Menu>
          </ListItem>
        </List>
      </Flex>
    </Flex>
  )
}

export default NavbarPrivate
