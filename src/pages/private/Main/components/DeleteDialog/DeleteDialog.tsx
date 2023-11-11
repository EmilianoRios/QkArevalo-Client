import { ClientModelMap, GlobalColors } from '@/models'
import { deleteOneClientService } from '@/services'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { Socket } from 'socket.io-client'

interface DeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  socket: Socket
  clientToDelete: ClientModelMap
  setClientToDelete: React.Dispatch<React.SetStateAction<ClientModelMap>>
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  clientToDelete,
  socket,
  setClientToDelete
}) => {
  const deleteOneClient = () => {
    try {
      const ClientReset: ClientModelMap = {
        id: '',
        name: '',
        dni: '',
        status: '',
        employee: { id: '', name: '' }
      }
      deleteOneClientService(clientToDelete.id).then(() => {
        socket.emit('client:deleteOneClientOfLists', {
          data: clientToDelete.id,
          employeeId: clientToDelete.employee && clientToDelete.employee.id
        })
        setClientToDelete(ClientReset)
      })
      onClose()
    } catch {
      onClose()
    }
  }

  const cancelRef = React.useRef(null)
  return (
    <>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent bg={GlobalColors.BORDERCONTENT}>
          <AlertDialogHeader>Eliminar Cliente</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text>Estas seguro que deseas eliminar a:</Text>
            <Text as='b'>
              {clientToDelete.name} - {clientToDelete.dni}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              bgGradient={GlobalColors.WARNINGCOLOR}
              ml={3}
              onClick={() => {
                deleteOneClient()
              }}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DeleteDialog
