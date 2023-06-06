import { GetStaticProps, NextPage } from 'next';
import { ZoneSwitch as UiSwitch } from '@/components/UiSwitch';
import { LineChart } from '@/components/Linechart';
import { Card, Grid, Row } from '@nextui-org/react';
import { useState } from 'react';
import { LuzResponse } from '@/interfaces/luzResponse';
import luzApi from '@/api/luzapi';
import { Layout } from '@/components/Layout';
import { AxiosResponse } from 'axios';
import styles from '@/styles/Home.module.css';

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
      <Card css={{ h: "40%", w: "98%", marginLeft: "1%", $$cardColor: '$colors$gradient' }}>
        <Card.Body>
          <h2 className="mx-auto mt-10 text-xl font-semibold capitalize ">{title}</h2>
          {/* Chart */}
          <Card>
            <Card.Body>
              <UiSwitch
                checked={isPeninsula}
                setIsPeninsula={setIsPeninsula}
                textValues={['Peninsula, Canarias y Baleares', 'Ceuta y Melilla']}></UiSwitch>
              <UiSwitch
                checked={inKilowatts}
                setIsPeninsula={setInKilowatts}
                textValues={['Resultados en Kwh', 'Resultados en Mwh']}></UiSwitch>
              <Grid.Container gap={2}>
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
            <Card css={{ w: "80%", marginLeft: "10%", $$cardColor: '$colors$neutral' }}>
              <Card.Body>
                <Grid.Container >
                  <Grid xs={1}></Grid>
                  <Grid xs={4}>
                    <Card css={{ $$cardColor: '$colors$success' }}>
                      <Card.Header >
                        <Row justify="center" align="center">
                          <h3>Hora de menor consumo:</h3>
                        </Row>
                      </Card.Header>
                      <Card.Body>
                        <Row justify="center" align="center">
                          <h4>{getMinorPrice()}</h4>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Grid>
                  <Grid xs={2}>
                  </Grid>
                  <Grid xs={4}>
                    <Card css={{ $$cardColor: '$colors$error' }}>
                      <Card.Header >
                        <Row justify="center" align="center">
                          <h3>Hora de mayor consumo:</h3>
                        </Row>
                      </Card.Header>
                      <Card.Body>
                        <Row justify="center" align="center">
                          <h4>{getMajorPrice()}</h4>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Grid>
                </Grid.Container>
              </Card.Body>
            </Card>
            <br />
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

