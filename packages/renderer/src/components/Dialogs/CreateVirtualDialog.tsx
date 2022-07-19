import { Ledfx } from "@/api/ledfx"
import { virtual } from "@/store/interfaces"
import { useStore } from "@/store/useStore"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Slider } from "@mui/material"
import { useEffect, useState } from "react"
import Frame from "../SchemaForm/Frame"

export interface CreateVirtualDialogProps {
    open: boolean
    handleClose: () => void
}

export const CreateVirtualDialog = (props: CreateVirtualDialogProps) => {
    const virtualSchema = useStore((store) => store.api.schema.virtual)
    const [config, setConfig] = useState({} as virtual["base_config"])
    const { open, handleClose } = props
    const [valid, setValid] = useState(false)

    const applyDefaults = () => (
        setConfig({
            name: virtualSchema["name"].default,
            framerate: virtualSchema["framerate"].default
        })
    )

    useEffect(applyDefaults, [])

    return (
        <Dialog open={open} onClose={handleClose} >
            <DialogTitle>Create Virtual</DialogTitle>
            <DialogContent>
                <Frame
                    title={virtualSchema["name"].title}
                    tip={virtualSchema["name"].description}
                >
                    <Input
                        value={config.name}
                        error={!valid}
                        onChange={(event) => {
                            setConfig({
                                ...config,
                                name: event.target.value
                            })
                            setValid(event.target.value !== "")
                        }}
                    />
                </Frame>
                <Frame
                    title={virtualSchema["framerate"].title}
                    tip={virtualSchema["framerate"].description}
                >
                    <Slider
                        min={virtualSchema["framerate"].validation.min}
                        max={virtualSchema["framerate"].validation.max}
                        valueLabelDisplay="auto"
                        step={5}
                        marks
                        value={config.framerate}
                        onChange={(event) => {
                            setConfig({
                                ...config,
                                framerate: event.target.value
                            })
                        }}
                    />
                </Frame>
            </DialogContent>
            <DialogActions>
                <Button disabled={!valid} variant="outlined" onClick={async () => {
                    await Ledfx("/api/virtuals", "POST", {"base_config": config})
                    handleClose()
                }}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
