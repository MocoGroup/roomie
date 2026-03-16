package br.edu.ufape.roomie.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class FileStorageService {

  private final Path fileStorageLocation;

  private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);
  public FileStorageService(@Value("${app.storage.upload-dir:uploads/imoveis}") String uploadDir) {
    this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

    try {
    Path configuredLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    this.fileStorageLocation = ensureWritableStoragePath(configuredLocation);
  }

  private Path ensureWritableStoragePath(Path configuredLocation) {
    try {
      Files.createDirectories(configuredLocation);
      return configuredLocation;
    } catch (IOException configuredPathError) {
      Path fallbackLocation =
          Paths.get(System.getProperty("java.io.tmpdir"), "roomie", "uploads")
              .toAbsolutePath()
              .normalize();
      try {
        Files.createDirectories(fallbackLocation);
        log.warn(
            "Falha ao criar diretório de upload configurado em {}. Usando fallback {}.",
            configuredLocation,
            fallbackLocation);
        return fallbackLocation;
      } catch (IOException fallbackError) {
        throw new IllegalStateException(
            "Não foi possível criar o diretório onde os arquivos serão armazenados.",
            fallbackError);
      }
    }
  public String storeFile(MultipartFile file) {
    String rawFileName = file.getOriginalFilename();
    if (rawFileName == null || rawFileName.isBlank()) {
      throw new IllegalArgumentException("Nome do arquivo inválido.");
    }

    String originalFileName = StringUtils.cleanPath(rawFileName);

    try {
      if (originalFileName.contains("..")) {
        throw new IllegalArgumentException(
            "Desculpe! O nome do arquivo contém um caminho inválido " + originalFileName);
      }

      String fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
      String newFileName = UUID.randomUUID().toString() + fileExtension;

      Path targetLocation = this.fileStorageLocation.resolve(newFileName);

      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

      return newFileName;

    } catch (IOException ex) {
      throw new IllegalStateException(
          "Não foi possível armazenar o arquivo "
              + originalFileName
              + ". Por favor, tente novamente!",
          ex);
    }
  }
}
