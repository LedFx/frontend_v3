/* eslint-disable no-param-reassign */
import { useStore, produce } from '@/store/useStore'
import axios from 'axios'
// import { useStore } from '@/store/useStore';


const baseURL = `${import.meta.env.VITE_CORE_PROTOCOL || 'http'}://${import.meta.env.VITE_CORE_HOST || 'localhost'}:${import.meta.env.VITE_CORE_PORT || '8080'}`
const storedURL = window.localStorage.getItem('ledfx-v3-host')

const api = axios.create({
	baseURL: storedURL || baseURL,
})


export const Ledfx = async (
	path: string,
	method?: 'GET' | 'PUT' | 'POST' | 'DELETE',
	body?: any
): Promise<any> => {
	const { setState } = useStore
	try {
		let response = null as any
		switch (method) {
		case 'PUT':
			response = await api.put(path, body)
			break
		case 'DELETE':
			response = await api.delete(path, body)
			break
		case 'POST':
			response = await api.post(path, body)
			break

		default:
			response = await api.get(path)
			break
		}
		if (response.status === 200) {
			setState(
				produce((state) => {
					state.disconnected = false
				})
			)
		} else {
			setState(
				produce((state) => {
					state.ui.snackbar = {
						isOpen: true,
						variant: 'error',
						message: response.error || JSON.stringify(response),
					}
				})
			)
		}
		return response.data || response
	} catch (error: any) {
		if (error.message) {
			return setState(
				produce((state) => {
					state.ui.snackbar = {
						isOpen: true,
						variant: 'error',
						message: JSON.stringify(error.message),
					}
				})
			)
		}
		setState(
			produce((state) => {
				state.ui.snackbar = {
					isOpen: true,
					variant: 'error',
					message: JSON.stringify(error, null, 2),
				}
			})
		)
	}
	return true
}
