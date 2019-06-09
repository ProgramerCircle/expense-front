import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception1003 = () => (
  <Exception
    type="1003"
    linkElement={Link}
    redirect='/team/manager'
    backText="返回主页"
  />
);

export default Exception1003;
