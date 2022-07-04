/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import Sockette from 'sockette';


function createSocket() {
    const _ws = new Sockette(
        'ws://localhost:8300/websocket',
      {
        timeout: 5e3,
        maxAttempts: 10,
        onopen: (e) => {
          console.log('NEW BASE Connected!', e);
          // document.dispatchEvent(
          //   new CustomEvent("disconnected", {
          //     detail: {
          //       isDisconnected: false
          //     }
          //   })
          // );
          (_ws as any).ws = e.target;
        },
        onmessage: (event) => {
          console.log('NEW BASE MSG!', event);
          if (JSON.parse(event.data).type) {
            document.dispatchEvent(
              new CustomEvent('YZNEW', { detail: JSON.parse(event.data) })
            );
          }
        },
        // onreconnect: e => console.log('Reconnecting...', e),
        // onmaximum: e => console.log('Stop Attempting!', e),
        onclose: (e) => {
          console.log('NEW BASE Closed!', e);
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
