import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, DataTable, Button, Icon, Page, Modal, TextContainer, Spinner } from "@shopify/polaris";
import { DeleteMinor, ViewMinor, ArrowDownMinor } from "@shopify/polaris-icons";

const Buckets = () => {
  const storeDetail = useSelector((state) => state.store.StoreDetail);
  const [BucketsList, setBucketsList] = useState([]);
  const [TableLoading, setTableLoading] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    if (storeDetail?.StoreId) {
      ListBuckets();
    }
  }, [storeDetail]);

  const handleDownloadfile = async (fileName, bucketName) => {
    try {
      const response = await fetch(
        `/api/download_file?storeId=${storeDetail.StoreId}&bucketName=${bucketName}&fileName=${fileName}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      // Convert response to a Blob (binary data)
      const blob = await response.blob();

      // Create a temporary URL for the file
      const url = window.URL.createObjectURL(blob);

      // Create a download link and trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log(`Download successful: ${fileName}`);
    } catch (error) {
      console.error(`Error downloading file (${fileName}):`, error);
    }
  };

  const ListBuckets = async () => {
    setTableLoading(true);
    try {
      const response = await fetch(`/api/get_bucketList?storeId=${storeDetail.StoreId}`, { method: "GET" });
      const data = await response.json();
      console.log("Buckets:", data);
      setBucketsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching bucket list:", error);
    } finally {
      setTableLoading(false);
    }
  };

  const ListFiles = async (bucketName) => {
    setFileLoading(true);
    try {
      const response = await fetch(
        `/api/get_fileList?storeId=${storeDetail.StoreId}&bucketName=${bucketName}`,
        { method: "GET" }
      );
      const data = await response.json();
      console.log("Files in Bucket:", data.Contents);
      setFileList(data.Contents || []);
    } catch (error) {
      console.error("Error fetching file list:", error);
      setFileList([]);
    } finally {
      setFileLoading(false);
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const handleView = async (bucket) => {
    setSelectedBucket(bucket);
    setModalActive(true);
    ListFiles(bucket.Name);
  };

  const handleDelete = async (bucketName) => {
    try {
      await fetch(`/api/delete_bucket?bucketName=${bucketName}&storeId=${storeDetail.StoreId}`, { method: "DELETE" });
      ListBuckets();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmpty = async (bucketName) => {
    try {
      await fetch(`/api/empty_Bucket?bucketName=${bucketName}&storeId=${storeDetail.StoreId}`, { method: "DELETE" });
      await handleDelete(bucketName);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Page title="Bucket List">
      <Card>
        {TableLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spinner size="large" />
          </div>
        ) : (
          <DataTable
            columnContentTypes={["text", "text", "numeric"]}
            headings={["Name", "Creation Date", "Actions"]}
            rows={BucketsList?.map((bucket) => [
              bucket.Name,
              bucket.CreationDate,
              <div style={{ display: "flex", gap: "10px" }}>
                <Button plain onClick={() => handleView(bucket)}>
                  <Icon source={ViewMinor} />
                </Button>
                <Button plain destructive onClick={() => handleEmpty(bucket.Name)}>
                  <Icon source={DeleteMinor} tone="critical" />
                </Button>
              </div>,
            ])}
          />
        )}
      </Card>

      {/* Polaris Modal for viewing bucket details */}
      {selectedBucket && (
        <Modal
          open={modalActive}
          onClose={() => setModalActive(false)}
          title={`Bucket Details - ${selectedBucket.Name}`}
          primaryAction={{
            content: "Close",
            onAction: () => setModalActive(false),
          }}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                <strong>Creation Date:</strong> {selectedBucket.CreationDate}
              </p>
              <p>
                <strong>Total Files:</strong> {fileLoading ? "Loading..." : fileList.length}
              </p>
            </TextContainer>

            {fileLoading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Spinner size="large" />
              </div>
            ) : fileList.length > 0 ? (
              <DataTable
                columnContentTypes={["text", "text", "text", "text"]}
                headings={["File Name", "Last Modified", "Size", "Download"]}
                rows={fileList.map((file) => [
                  file.Key,
                  new Date(file.LastModified).toLocaleString(),
                  formatFileSize(file.Size),
                  <Button
                    plain
                    icon={ArrowDownMinor}
                    onClick={() => handleDownloadfile(file.Key, selectedBucket.Name)}
                  />,
                ])}
              />
            ) : (
              <p>No files found in this bucket.</p>
            )}
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
};

export default Buckets;
