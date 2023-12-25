import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';
import { useNFTCollectionContract } from './hooks/useNFTCollectionContract';
import '@twa-dev/sdk';


function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();
  const { collectionInfo, nftCollectionAddress, deployNFTCollection } = useNFTCollectionContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address ?? 'Loading...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            deployNFTCollection();
          }}
        >
          Create NFT Collection
        </a>

        <div className='Card'>
          <b>NFT Collection Address</b>
          <div>{nftCollectionAddress ?? 'Loading...'}</div>
        </div>

        <div className='Card'>
          <b>Next item index</b>
          <div>{collectionInfo?.nextItemIndex ?? 'Loading...'}</div>
        </div>

        <div className='Card'>
          <b>Collection url:</b>
          <div>{collectionInfo?.content ?? 'Loading...'}</div>
        </div>

        <div className='Card'>
          <b>Collection owner:</b>
          <div>{collectionInfo?.owner ?? 'Loading...'}</div>
        </div>

      </div>
    </div>
  );
}

export default App