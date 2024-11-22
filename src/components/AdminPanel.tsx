'use client'

import { useState, useEffect } from 'react'
import { Upload, Input, Button, Card, List, Image, Typography, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'

const { Title } = Typography

interface Settings {
  qrCodeImage: string
  totalAmount: number
}

interface PaymentProof {
  id: number
  image: string
  createdAt: string
}

export function AdminPanel () {
  const [qrCodes, setQRCodes] = useState<Array<{ id: number, image: string, createdAt: string }>>([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [proofs, setProofs] = useState<Array<{ id: number, image: string, createdAt: string }>>([]);

  useEffect(() => {
    fetchQRCodes()
    fetchProofs()
  }, [])

  const fetchQRCodes = async () => {
    const response = await fetch('/api/settings');
    const data = await response.json();
    setQRCodes(data);
  };

  const fetchProofs = () => {
    fetch('/api/payment-proofs')
      .then(res => res.json())
      .then(data => setProofs(data))
  }

  const handleProofUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string

      await fetch('/api/payment-proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64String })
      })

      fetchProofs()
      setTimeout(() => {
        fetchProofs()
      }, 3000)
      message.success('凭证上传成功')
    }
    reader.readAsDataURL(file)
    return false
  }

  const handleQRCodeUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string

      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64String })
      })

      fetchQRCodes()
      setTimeout(() => {
        fetchQRCodes()
      }, 3000)
      message.success('凭证上传成功')
    }
    reader.readAsDataURL(file)
    return false
  }


  const handleDeleteProof = async (id: number) => {
    if (!confirm('确定要删除这条收款凭证吗？')) {
      return;
    }

    try {
      const response = await fetch('/api/payment-proofs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      // 更新显示的凭证列表
      setProofs(prevProofs =>
        prevProofs.filter(proof => proof.id !== id)
      );
    } catch (error) {
      console.error('删除凭证时出错:', error);
      alert('删除凭证失败，请重试');
    }
  };

  const handleQRCodeDelete = async (id: number) => {
    if (!confirm('确定要删除这个收款二维码吗？')) {
      return;
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      // 更新显示的凭证列表
      setQRCodes(qrcodes =>
        qrcodes.filter(qr => qr.id !== id)
      );
    } catch (error) {
      console.error('删除凭证时出错:', error);
      alert('删除凭证失败，请重试');
    }
  };



  return (
    <div className="max-w-4xl mx-auto p-6">
      <Title level={2}>后台管理</Title>

      <Card title="收款设置" className="mb-8">
        <div className="mb-6">
          <Typography.Text strong>收款二维码</Typography.Text>
          <div className="mt-2">
            <Upload
              beforeUpload={handleQRCodeUpload}
              accept="image/*"
              maxCount={1}
              showUploadList={false}
              className='mb-12'
            >
              <Button icon={<UploadOutlined />}>上传新二维码</Button>
            </Upload>

            <div className="grid grid-cols-3 gap-4">
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={qrCodes}
                renderItem={(qr) => (
                  <List.Item>
                    <Card>
                      <Image
                        src={qr.image}
                        alt={`qrcode ${qr.id}`}
                        width="100%"
                      />
                      <Typography.Text type="secondary" className="mt-2 block">
                        {new Date(qr.createdAt).toLocaleString()}
                      </Typography.Text>
                      <Button type="link" onClick={() => handleQRCodeDelete(qr.id)}>
                        删除
                      </Button>
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="收款凭证">
        <div className="mb-6">
          <Upload
            beforeUpload={handleProofUpload}
            accept="image/*"
            maxCount={1}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>上传新凭证</Button>
          </Upload>
        </div>

        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={proofs}
          renderItem={(proof) => (
            <List.Item>
              <Card>
                <Image
                  src={proof.image}
                  alt={`凭证 ${proof.id}`}
                  width="100%"
                />
                <Typography.Text type="secondary" className="mt-2 block">
                  {new Date(proof.createdAt).toLocaleString()}
                </Typography.Text>
                <Button type="link" onClick={() => handleDeleteProof(proof.id)}>
                  删除
                </Button>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}