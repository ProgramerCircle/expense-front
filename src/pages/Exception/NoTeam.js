import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception1001 = () => (
  <Exception
    type="1001"
    linkElement={Link}
    redirect='/team/join'
    backText="前去加入"
  />
);

export default Exception1001;
