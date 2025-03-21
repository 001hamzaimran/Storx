import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Card, DataTable, Button, Icon, Page, Modal, TextContainer, Spinner, Tooltip } from "@shopify/polaris";
import { DeleteMinor, ViewMinor, ArrowDownMinor } from "@shopify/polaris-icons";

const Buckets = () => {
  const storeDetail = useSelector((state) => state.store.StoreDetail);
  const [BucketsList, setBucketsList] = useState([]);
  const [TableLoading, setTableLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    if (storeDetail?.StoreId) {
      ListBuckets();
    }
  }, [storeDetail]);

  const downloadFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => window.URL.revokeObjectURL(url), 3000);
    document.body.removeChild(a);
  };

  const handleDownloadfile = async (fileName, bucketName) => {
    try {
      const response = await fetch(
        `/api/download_file?storeId=${storeDetail.StoreId}&bucketName=${bucketName}&fileName=${fileName}`,
        { method: "GET" }
      );

      if (!response.ok) {
        toast.error(`Failed to download file: ${response.statusText}`);
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const blob = await response.blob();
      downloadFile(blob, fileName);
      toast.success(`File downloaded successfully: ${fileName}`);
    } catch (error) {
      console.error(`Error downloading file (${fileName}):`, error);
    }
  };

  const ListBuckets = async () => {
    setTableLoading(true);
    try {
      const response = await fetch(`/api/get_bucketList?storeId=${storeDetail.StoreId}`, { method: "GET" });
      const data = await response.json();
      setBucketsList(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Error fetching bucket list, reload the page.");
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
    setDeleting(bucketName);

    try {
      const emptyBucketRequest = fetch(
        `/api/empty_Bucket?bucketName=${bucketName}&storeId=${storeDetail.StoreId}`,
        { method: "DELETE" }
      );

      const deleteBucketRequest = fetch(
        `/api/delete_bucket?bucketName=${bucketName}&storeId=${storeDetail.StoreId}`,
        { method: "DELETE" }
      );

      // Run both API calls in parallel
      const results = await Promise.allSettled([emptyBucketRequest, deleteBucketRequest]);

      const emptyBucketStatus = results[0].status;
      const deleteBucketStatus = results[1].status;

      if (deleteBucketStatus === "fulfilled") {
        toast.success("Bucket deleted successfully");
        ListBuckets(); // Refresh the bucket list
      } else {
        toast.error("Failed to delete bucket");
      }

      if (emptyBucketStatus === "rejected") {
        toast.error("Failed to empty bucket before deletion");
      }
    } catch (error) {
      console.error(`Error deleting bucket ${bucketName}:`, error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleLatestBackup = async () => {
    if (BucketsList.length === 0) {
      toast.error("No backups available.");
      return;
    }

    // Get the latest bucket based on the most recent creation date
    const latestBucket = BucketsList.reduce((latest, current) =>
      new Date(current.CreationDate) > new Date(latest.CreationDate) ? current : latest
    );

    setSelectedBucket(latestBucket);
    setModalActive(true);
    ListFiles(latestBucket.Name);
  };

  return (
    <Page title="Bucket List">
      <Card sectioned>
        {TableLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spinner size="large" />
          </div>
        ) : BucketsList?.length > 0 ? (
          <DataTable
            columnContentTypes={["text", "text", "numeric"]}
            headings={["Name", "Creation Date", "Actions"]}

            rows={BucketsList?.map((bucket) => [
              bucket.Name,
              new Date(bucket.CreationDate).toLocaleDateString(),
              <div style={{ display: "flex", gap: "10px" }}>
                <Tooltip content="View Files">
                  <Button plain onClick={() => handleView(bucket)}>
                    <Icon source={ViewMinor} />
                  </Button>
                </Tooltip>
                <Tooltip content="Delete Bucket">
                  <Button
                    plain
                    destructive
                    onClick={() => handleDelete(bucket.Name)}
                    loading={deleting === bucket.Name}
                  >
                    <Icon source={DeleteMinor} tone="critical" />
                  </Button>
                </Tooltip>
              </div>,
            ])}
          />
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>No Buckets Found</p>
        )}

        <div style={{ margin: "1rem 0 0 0", textAlign: "right" }}>
          <Button primary onClick={handleLatestBackup}>Latest Backup</Button>
        </div>
      </Card>

      {/* Modal for Viewing Latest Backup */}
      {selectedBucket && (
        <Modal
          open={modalActive}
          onClose={() => setModalActive(false)}
          title={`Latest Backup - ${selectedBucket.Name}`}
          primaryAction={{
            content: "Close",
            onAction: () => setModalActive(false),
          }}
        >
          <Modal.Section>
            <TextContainer>
              <p><strong>Creation Date:</strong> {new Date(selectedBucket.CreationDate).toLocaleDateString()}</p>
              <p><strong>Total Files:</strong> {fileLoading ? "Loading..." : fileList.length}</p>
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
                  new Date(file.LastModified).toLocaleDateString(),
                  formatFileSize(file.Size),
                  <Button plain icon={ArrowDownMinor} onClick={() => handleDownloadfile(file.Key, selectedBucket.Name)} />,
                ])}
              />
            ) : (
              <p>No files found in this backup.</p>
            )}
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
};

export default Buckets;
                       
                       
                       
                        