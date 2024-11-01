import { GetStaticProps, NextPage } from 'next';
import { ZoneSwitch as UiSwitch } from '@/components/UiSwitch';
import { LineChart } from '@/components/Linechart';
import { Card, Grid, Row } from '@nextui-org/react';
import { useState } from 'react';
import { LuzResponse } from '@/interfaces/luzResponse';
import luzApi from '@/api/luzapi';
import { Layout } from '@/components/Layout';

interface MarkHour {
  price: number,
  hour: string
}

interface Props {
  title: string,
  luzPricesPcb?: LuzResponse,
  luzPricesCym?: LuzResponse,
  minorPricePcb: MarkHour,
  minorPriceCym: MarkHour,
  majorPricePcb: MarkHour,
  majorPriceCym: MarkHour
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const dataPcb = await luzApi.get<LuzResponse>('/prices/all?zone=PCB');
  const dataCym = await luzApi.get<LuzResponse>('/prices/all?zone=CYM');
  const minorPricePcb = getLowestPrice(dataPcb.data);
  const minorPriceCym = getLowestPrice(dataCym.data);
  const majorPricePcb = getHighestPrice(dataPcb.data);
  const majorPriceCym = getHighestPrice(dataCym.data);

  return {
    props: {
      title: "Coste de la luz diario:",
      luzPricesPcb: dataPcb?.data || {},
      luzPricesCym: dataCym?.data || {},
      minorPricePcb,
      minorPriceCym,
      majorPricePcb,
      majorPriceCym
    },
    revalidate: 20, // each day we regenerate static props
  }
}

const MainPage: NextPage<Props> = ({ title, luzPricesPcb, luzPricesCym, minorPricePcb, minorPriceCym, majorPricePcb, majorPriceCym }) => {

  const [isPeninsula, setIsPeninsula] = useState(true);
  const [inKilowatts, setInKilowatts] = useState(false);


  function getMinorPrice(): string {
    if (isPeninsula)
      return (minorPricePcb.price / (inKilowatts ? 100 : 1)) + (inKilowatts ? " €/Kwh" : " €/Mwh") + " en franja " + minorPricePcb.hour + "h";
    else
      return (minorPriceCym.price / (inKilowatts ? 100 : 1)) + (inKilowatts ? " €/Kwh" : " €/Mwh") + " en franja " + minorPriceCym.hour + "h";
  }

  function getMajorPrice(): string {
    if (isPeninsula)
      return (majorPricePcb.price / (inKilowatts ? 100 : 1)) + (inKilowatts ? " €/Kwh" : " €/Mwh") + " en franja " + majorPricePcb.hour + "h";
    else
      return (majorPriceCym.price / (inKilowatts ? 100 : 1)) + (inKilowatts ? " €/Kwh" : " €/Mwh") + " en franja " + majorPriceCym.hour + "h";
  }

  return (
    <Layout>
      <Card css={{ marginLeft: "1%", $$cardColor: '$colors$gradient' }} style={{ height: '100%' }}>
        <Card.Body>
          <h2 className="mx-auto mt-10 text-xl font-semibold capitalize ">{title}</h2>
          {/* Chart */}
          <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
            <Card.Body style={{ width: '100%', height: '80%' }}>
              <div style={{ height: '15%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'space-evenly', gap: "20px" }}>
                <UiSwitch
                  checked={isPeninsula}
                  setIsPeninsula={setIsPeninsula}
                  textValues={['Peninsula, Canarias y Baleares', 'Ceuta y Melilla']}></UiSwitch>
                <UiSwitch
                  checked={inKilowatts}
                  setIsPeninsula={setInKilowatts}
                  textValues={['Resultados en Kwh', 'Resultados en Mwh']}></UiSwitch>
              </div>
              <Grid.Container gap={2} style={{ height: '85%' }}>
                <Grid md={12}>
                  <LineChart
                    data={isPeninsula ? luzPricesPcb : luzPricesCym}
                    enabled={isPeninsula}
                    borderColor={isPeninsula ? "#3e95cd" : "#35B600"}
                    backgroundColor={isPeninsula ? "#007ECF" : "#206F00"}
                    inKilowatts={inKilowatts}></LineChart>
                </Grid>
              </Grid.Container>
            </Card.Body>
            {/* Summary */}
            <Card css={{ w: "80%", height: '20%', marginBottom: '10px', $$cardColor: '$colors$neutral' }}>
              <Card.Body style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                  <Card css={{ $$cardColor: '$colors$success' }} style={{ width: '40%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h4>Hora de menor consumo:</h4>
                    <h4>{getMinorPrice()}</h4>
                  </Card>
                  <Card css={{ $$cardColor: '$colors$error' }} style={{ width: '40%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'  }}>
                    <h4>Hora de mayor consumo:</h4>
                    <h4>{getMajorPrice()}</h4>
                  </Card>
              </Card.Body>
            </Card>
          </Card>
        </Card.Body>
      </Card>
    </Layout>
  )

};

export default MainPage;

function getLowestPrice(dataPcb: LuzResponse) {
  let lowestPrice = Infinity;
  let lowestHour = "";
  const obj: any = {
    ...dataPcb
  };

  for (const key in obj) {
    const price = obj[key].price;
    const hour = obj[key].hour;
    if (price < lowestPrice) {
      lowestPrice = price;
      lowestHour = hour;
    }
  }
  return {
    price: lowestPrice,
    hour: lowestHour
  };
}

function getHighestPrice(dataPcb: LuzResponse) {
  let lowestPrice = -1.0;
  let lowestHour = "";
  const obj: any = {
    ...dataPcb
  };

  for (const key in obj) {
    const price = obj[key].price;
    const hour = obj[key].hour;
    if (price > lowestPrice) {
      lowestPrice = price;
      lowestHour = hour;
    }
  }
  return {
    price: lowestPrice,
    hour: lowestHour
  };
}

