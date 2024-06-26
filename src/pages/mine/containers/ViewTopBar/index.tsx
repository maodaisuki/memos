import React from 'react';
import { FcSearch } from 'react-icons/fc';
import { RiRefreshLine } from 'react-icons/ri';
import classNames from 'classnames';

import { db } from '@/store/db';
import MineStoreContainer from '@/store/MineStoreContainer';

import MainViewMenu from '@/pages/mine/components/MainViewMenu';
import Styles from './ViewTopBar.module.less';

interface handleSearchAllProps {
  searchTargetValue: string;
  setMemoList: (params: Record<string, any>[]) => void;
}

const handleSearchAll = async ({ searchTargetValue, setMemoList }: handleSearchAllProps) => {
  const res = await db.memo
    .orderBy('created_at')
    .reverse()
    .filter((item) => item.body.includes(searchTargetValue))
    .toArray();

  setMemoList(res);
};

interface ViewTopBarProps {
  title: string;
  search?: boolean;
  refresh?: boolean;
}

const Refresh = () => {
  const { syncLoading } = MineStoreContainer.usePicker(['syncLoading']);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }}>
      <RiRefreshLine
        className={classNames(Styles.refresh, `${syncLoading ? '' : Styles['refresh-paused']}`)}
        style={{ fontSize: '18px' }}
      />
    </span>
  );
};

const ViewTopBar: React.FC<ViewTopBarProps> = ({ title, search = false, refresh = false }) => {
  const { setMemoList } = MineStoreContainer.usePicker(['setMemoList']);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={Styles['top-bar']}>
      <div className={Styles.left}>
        <MainViewMenu />
        <span>{title}</span>
        {refresh && <Refresh />}
      </div>

      {search && (
        <div className={Styles['search-bar-container']}>
          <div className={Styles['search-bar-inputer']}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8e8e8e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder=""
              onKeyPress={(event) => {
                const searchTargetValue = searchInputRef?.current!.value;

                if (event.code === 'Enter') handleSearchAll({ searchTargetValue, setMemoList });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTopBar;
