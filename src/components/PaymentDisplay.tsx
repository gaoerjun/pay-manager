'use client'

import { useEffect, useState } from 'react'
import { Card, List, Image, Typography, Spin } from 'antd'

const { Title } = Typography

interface Settings {
  id: number
  image: string
  createdAt: string
}

interface PaymentProof {
  id: number
  image: string
  createdAt: string
}

export function PaymentDisplay () {
  const [settings, setSettings] = useState<Settings[]>([])
  const [proofs, setProofs] = useState<PaymentProof[]>([])

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))

    const fetchProofs = () => {
      fetch('/api/payment-proofs')
        .then(res => res.json())
        .then(data => setProofs(data))
    }

    fetchProofs()
    const interval = setInterval(fetchProofs, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!settings) return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>

  return (
    <div className="container mx-auto p-8">
      {/* <Title className="text-center" style={{ textAlign: "center" }}>收款信息展示</Title> */}
      <div className="grid grid-cols-2 gap-8" style={{ display: 'flex', height: "calc(100vh - 30px)", }}>
        <Card title="收款二维码" className='flex1' style={{ height: '100%' }}>
          <div className='grid-box'>
            {settings?.map(qrCode => {
              return <div >
                <img
                  src={qrCode.image}
                  alt="收款二维码"
                  style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', margin: '0 auto' }}
                />
              </div>
            })
            }
          </div>

        </Card>

        <Card title="收款凭证" className='flex1'>
          <List
            dataSource={proofs}
            style={{ maxHeight: "calc(100vh - 130px)", overflow: 'auto' }}
            renderItem={(proof) => (
              <List.Item>
                <Card>
                  <img
                    src={proof.image}
                    alt={`凭证 ${proof.id}`}
                    width="100%"
                  />
                  <Typography.Text type="secondary" className="mt-2 block">
                    {new Date(proof.createdAt).toLocaleString()}
                  </Typography.Text>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  )
}