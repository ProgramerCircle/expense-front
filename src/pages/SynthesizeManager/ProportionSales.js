import React, { memo } from 'react';
import { Card, Radio } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import styles from './Analysis.less';
import { Pie } from '@/components/Charts';
import Yuan from '@/utils/Yuan';

const ProportionSales = memo(
  ({ dropdownGroup, salesType, loading, salesPieData, handleChangeSalesType }) => (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title={
        <FormattedMessage
          id="app.analysis.the-proportion-of-sales"
          defaultMessage="The Proportion of Sales"
        />
      }
      bodyStyle={{ padding: 24 }} style={{ marginTop: 24 }}
    >
      <h4 style={{ marginTop: 10, marginBottom: 32 }}>
        <FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />
      </h4>
      <Pie
        hasLegend
        subTitle={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
        total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
        data={salesPieData}
        valueFormat={value => <Yuan>{value}</Yuan>}
        height={270}
        lineWidth={4}
        style={{ padding: '8px 0' }}
      />
    </Card>
  )
);

export default ProportionSales;
