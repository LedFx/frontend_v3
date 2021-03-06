import { Ledfx } from '@/api/ledfx'
import { device, controller } from '@/store/interfaces'
import { useStore } from '@/store/useStore'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Slider } from '@mui/material'
import { useEffect, useState } from 'react'
import { DeviceSchemaForm } from '../SchemaForm/DeviceSchemaForm'
import Frame from '../SchemaForm/Frame'

export interface CreateDeviceDialogProps {
    id?: string
    open: boolean
    handleClose: () => void
}

export const CreateDeviceDialog = (props: CreateDeviceDialogProps) => {
    const { id, open, handleClose } = props
    const devices = useStore((store) => store.api.devices)
    const [device, setDevice] = useState({} as device)
    const [valid, setValid] = useState(id !== undefined)

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg">
            <DialogTitle>{id === undefined ? 'Create' : 'Configure'} Device</DialogTitle>
            <DialogContent>
                <DeviceSchemaForm id={id}/>
            </DialogContent>
            <DialogActions>
                <Button disabled={!valid} variant="outlined" onClick={async () => {
                    await Ledfx("/api/devices", "POST", { "id": id, "base_config": config })
                    handleClose()
                }}>{id === undefined ? 'Create' : 'Update'}</Button>
            </DialogActions>
        </Dialog>
    )
}
