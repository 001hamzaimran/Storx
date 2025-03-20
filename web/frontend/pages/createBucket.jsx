import React, { useState, useCallback, useEffect } from 'react';
import { Page, Card, Select, Button, Layout, TextContainer, TextField } from '@shopify/polaris';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function CreateBucket() {
    const storeDetail = useSelector((state) => state.store.StoreDetail);
    const backupDetail = useSelector((state) => {
        console.log("Redux State:", state.backup);
        return state.backup;
    })
    const [backupFrequency, setBackupFrequency] = useState('daily');
    const [backupTime, setBackupTime] = useState('00:00');
    const [Submitting, setSubmitting] = useState(false);
    const [storeFetched, setstoreFetched] = useState(false)

    useEffect(() => {
        setstoreFetched(true)
    }, [storeDetail])

    const handleBackupFrequencyChange = useCallback((value) => setBackupFrequency(value), []);
    const handleBackupTimeChange = useCallback((value) => setBackupTime(value), []);

    // useEffect(() => {
    //     getCronjob();
    // }, []);

    const creatingBucket = async () => {
        try {
            const response = await fetch(`/api/checkingBucket?storeId=${storeDetail.StoreId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Products: backupDetail.Products
                    })
                }
            )
            const data = await response.json()
            console.log("Bucket", data);
        } catch (error) {
            console.log("Errore ", error)
        }
    }

    const getCronjob = async () => {
        try {
            const response = await fetch(`/api/get_cron?Store_Id=${storeDetail.StoreId}`, {
                method: 'GET',
            });
            const data = await response.json();
            setBackupFrequency(data.CronJob);
            setBackupTime(data.backupTime || '00:00');
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await fetch("/api/set_cron", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Store_Id: storeDetail.StoreId,
                    Store_name: storeDetail.Store_name,
                    CronJob: backupFrequency,
                    backupTime,

                }),
            });

            const data = await response.json();
            console.log("Set Cron Job ", data, backupTime);
            creatingBucket();

            toast.success(data.message + " on a " + backupFrequency + " basis at " + backupTime);
        } catch (error) {
            toast.error("Failed to set cron job. Please try again.");
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Page title="Set the Time for Data Backup">
            <Layout>
                <Layout.Section>
                    <Card title="Description" sectioned>
                        <TextContainer>
                            <p>
                                {backupFrequency === 'daily'
                                    ? 'Your store\'s data will be backed up daily to your Storx account, with each backup stored in a new bucket named after the respective date.'
                                    : 'Your store\'s data will be backed up weekly, every first day of the week, to your Storx account. Each backup will be stored in a new bucket named after the backup date.'}
                            </p>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card title="Cron Job Scheduling" sectioned>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3%' }}>
                            <div style={{ width: '70%' }}>
                                <Select
                                    label="Set Backup Frequency"
                                    options={[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }]}
                                    value={backupFrequency}
                                    onChange={handleBackupFrequencyChange}
                                />
                            </div>
                            <div style={{ width: '30%' }}>
                                <TextField
                                    label="Backup Time"
                                    type="time"
                                    value={backupTime}
                                    onChange={handleBackupTimeChange}
                                />
                            </div>
                        </div>
                         
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}