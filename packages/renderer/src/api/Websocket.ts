/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useStore } from '../store/useStore'
import { useLocation } from 'react-router-dom';
import Sockette from 'sockette';
import { VariantType } from 'notistack';

enum eventType {
  Log,
  Shutdown,
  EffectRender,
  EffectUpdate,
  EffectDelete,
  GlobalEffectUpdate,
  VirtualUpdate,
  VirtualDelete,
  DeviceUpdate,
  DeviceDelete,
  ConnectionsUpdate,
}

interface LedFxEvent {
  timestamp: string,
  type: eventType,
  title: string,
  data: Record<string, any>
}

function handleMessage(e: MessageEvent) {
  const showSnackbar = useStore.getState().ui.showSnackbar
  const event: LedFxEvent = JSON.parse(e.data)
  console.log("Received event:", event)
  switch (event.type) {
    case eventType.Log:
      console.log(event.data);
      showSnackbar(event.data.level as VariantType, event.data.msg)
  }
}

function createSocket() {
  const _ws = new Sockette(
    'ws://localhost:8080/websocket',
    {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: (e: Event) => {
        console.log('Connected to LedFx Server', e);
        (_ws as any).ws = e.target;
      },
      onmessage: (e: Event) => {
        console.log('Message from LedFx Server', e);
        handleMessage(e as MessageEvent);
      },
      onreconnect: (e: Event) => console.log('Reconnecting to LedFx Server...', e),
      onmaximum: (e: Event) => console.log('Maximum reconnect attempts to LedFx Server', e),
      onclose: (e: Event) => {
        console.log('Disconnected from LedFx Server', e);
        // document.dispatchEvent(
        //   new CustomEvent("disconnected", {
        //     detail: {
        //       isDisconnected: true
        //     }
        //   })
        // );
      },
      // onerror: e => console.log('Error:', e)
    }
  );
  return _ws;
}
const ws = createSocket();
export default ws;
export const WsContext = React.createContext(ws);

export const HandleWs = () => {
  const { pathname } = useLocation();
  const [wsReady, setWsReady] = useState(false);

  useLayoutEffect(() => {
    if (!wsReady) {
      if (ws && (ws as any).ws) {
        setWsReady(true);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (wsReady) {
      const getWs = async () => {
        const request = {
          message: 'frontend connected',
          id: 1,
          type: 'success',
        };
        (ws as any).send(JSON.stringify(++request.id && request));
      };
      getWs();

      return () => {
        const removeGetWs = async () => {
          const request = {
            id: 2,
            type: 'unsubscribe_event',
            event_type: 'visualisation_update',
          };
          (ws as any).send(JSON.stringify(++request.id && request));
        };
        removeGetWs();
      };
    }
  }, [wsReady]);

  useEffect(() => {
    if (!wsReady) {
      if (ws && (ws as any).ws) {
        setWsReady(true);
      }
    }
  }, [wsReady, ws]);

  return null;
};
