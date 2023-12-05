import { ClientModelMap, StatusClient } from '@/models'
import {
  getAllClientsForEmployeeService,
  getAllClientsService
} from '@/services'
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react'
import { useCallback } from 'react'

interface CreatePdfProps {
  isMyClients: boolean
  idUser: string
}

const CreatePdf: React.FC<CreatePdfProps> = ({ isMyClients, idUser }) => {
  const [listOfClients, setListOfClients] = useState<ClientModelMap[]>([])

  const fetchClients = useCallback(async () => {
    if (isMyClients) {
      const myClients = await getAllClientsForEmployeeService(idUser)
      setListOfClients(myClients.myClients)
    } else {
      const allClients = await getAllClientsService({ pgsize: 5000 })
      setListOfClients(allClients.allClients)
    }
  }, [isMyClients, idUser])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const stylesRow = StyleSheet.create({
    row: {
      flexDirection: 'row',
      borderBottomColor: '#B7FBCD',
      borderBottomWidth: 1,
      alignItems: 'center',
      height: 24,
      fontStyle: 'bold'
    },
    name: {
      paddingLeft: 5,
      width: '40%',
      borderRightColor: 'gray',
      borderRightWidth: 1
    },
    dni: {
      paddingLeft: 5,
      width: '20%',
      borderRightColor: 'gray',
      borderRightWidth: 1
    },
    status: {
      paddingLeft: 5,
      width: '20%',
      borderRightColor: 'gray',
      borderRightWidth: 1
    },
    of: {
      paddingLeft: 5,
      width: '20%'
    }
  })
  const stylesHeader = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 11,
      paddingTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 30,
      lineHeight: 1.5,
      flexDirection: 'column'
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 12,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey'
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: 'center',
      color: 'grey'
    },
    container: {
      flexDirection: 'row',
      borderBottomColor: '#DAFEE5',
      backgroundColor: '#DAFEE5',
      borderBottomWidth: 1,
      alignItems: 'center',
      height: 24,
      textAlign: 'center',
      fontStyle: 'bold',
      flexGrow: 1
    },
    name: {
      paddingLeft: 5,
      width: '40%',
      borderRightColor: '#53ea85',
      borderRightWidth: 1
    },
    dni: {
      paddingLeft: 5,
      width: '20%',
      borderRightColor: '#53ea85',
      borderRightWidth: 1
    },
    status: {
      paddingLeft: 5,
      width: '20%',
      borderRightColor: '#53ea85',
      borderRightWidth: 1
    },
    of: {
      paddingLeft: 5,
      width: '20%'
    }
  })
  const styleContainer = StyleSheet.create({
    tableContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      borderWidth: 1,
      borderColor: '#DAFEE5'
    }
  })

  const setNameOfStatus = (status: string) => {
    if (status === StatusClient.PAID) {
      return 'PAGADO'
    } else if (status === StatusClient.PENDING) {
      return 'PENDIENTE'
    } else if (status === StatusClient.CANCELLED) {
      return 'CANCELADO'
    }

    return 'POR DEFECTO'
  }

  return (
    <Document>
      <Page size='A4' style={stylesHeader.page}>
        <Text style={stylesHeader.header} fixed>
          ~ Cucañero Fiesta ~
        </Text>
        <View style={styleContainer.tableContainer}>
          <View style={stylesHeader.container}>
            <Text style={stylesHeader.name}>Nombre</Text>
            <Text style={stylesHeader.dni}>DNI</Text>
            <Text style={stylesHeader.status}>Estado</Text>
            <Text style={stylesHeader.of}>De</Text>
          </View>
          {listOfClients &&
            listOfClients.map((client: ClientModelMap) => (
              <View style={stylesRow.row} key={client.id}>
                <Text style={stylesRow.name}>{client.name}</Text>
                <Text style={stylesRow.dni}>
                  {client.dni ? client.dni : 'Sin DNI.'}
                </Text>
                <Text style={stylesRow.status}>
                  {setNameOfStatus(client.status)}
                </Text>
                <Text style={stylesRow.of}>{client.employee?.name}</Text>
              </View>
            ))}
        </View>
        <Text
          style={stylesHeader.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}

export default CreatePdf
